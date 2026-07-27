import os
from Parser.scanner import get_python_files
from Parser.extractor import parse_file
from Parser.models import ResolvedCall, RepositoryMetadata
# from .models import RepositoryMetadata
def build_file_index(files, repo_path):

    index = {}

    for file in files:

        filename = os.path.splitext(
            os.path.basename(file)
        )[0]

        index[filename] = file

        relative_path = os.path.relpath(
            file,
            repo_path
        )

        module_path = (
            relative_path
            .replace("\\", ".")
            .replace("/", ".")
        )

        module_path = os.path.splitext(
            module_path
        )[0]

        index[module_path] = file

        # Package support
        if module_path.endswith(".__init__"):

            package_name = module_path.removesuffix(".__init__")

            index[package_name] = file

    return index
def build_function_index(repository):

    index = {}

    for file in repository.files:

        for function in file.functions:

            index[function.name] = (
                file.file_path
            )

    return index
def parse_repository(repo_path):

    repository = RepositoryMetadata(
        repository_name=os.path.basename(
            repo_path
        )
    )

    files = get_python_files(repo_path)
    file_index = build_file_index(files, repo_path)
    for file in files:
        try:
            metadata = parse_file(file, repo_path)
        except Exception:
            print(f"Error parsing: {file}")
            raise
        repository.files.append(metadata)

    for metadata in repository.files:

        for imported in metadata.imports:
            resolved = file_index.get(imported.module)
            if resolved:
                dependency_path = os.path.relpath(
                resolved,
                repo_path
            )
                imported.is_internal = True
                imported.resolved_path = dependency_path
                metadata.dependencies.append(dependency_path)
            else:
                imported.is_internal = False
                imported.resolved_path = None
    function_index = build_function_index(repository)
    for file in repository.files:
        for function in file.functions:
            for call in function.calls:

                if "." in call:
                    continue
                resolved = False

            # 1. Check imported symbols first
                for imported in file.imports:

                    if call in imported.symbols and imported.is_internal:

                        function.resolved_calls.append(
                        ResolvedCall(
                            function=call,
                            file=imported.resolved_path
                        )
                    )

                        resolved = True
                        break

            # Already resolved from an import
                if resolved:
                    continue

            # 2. Fall back to existing lookup
                if call in function_index:

                    function.resolved_calls.append(
                    ResolvedCall(
                        function=call,
                        file=function_index[call]
                    )
                )
                if call in function_index:
                    function.resolved_calls.append(

                    ResolvedCall(
                        function=call,
                        file=function_index[call]
                    )

                )
                    
    return repository