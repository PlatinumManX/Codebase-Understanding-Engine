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
        # for dotted imports
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

        metadata = parse_file(file, repo_path)

        repository.files.append(metadata)
        # Dependency Resolution

    for metadata in repository.files:

        for imported_module in metadata.imports:

            if imported_module in file_index:

                dependency_path = os.path.relpath(
                    file_index[imported_module],
                    repo_path
                )

                metadata.dependencies.append(
                    dependency_path
                )
    function_index = build_function_index(repository)
    for file in repository.files:
        for function in file.functions:
            for call in function.calls:

                if "." in call:
                    continue
                if call in function_index:
                    function.resolved_calls.append(

                    ResolvedCall(
                        function=call,
                        file=function_index[call]
                    )

                )
                    
    return repository