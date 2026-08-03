import os
IGNORE_DIRS = {
    "venv",
    ".venv",
    "env",
    "__pycache__",
    ".git",
    "node_modules",
    "site-packages",
    ".idea",
    ".vscode",
    ".pytest_cache",
    ".mypy_cache",
    ".tox",
    "build",
    "dist"
}
SUPPORTED_EXTENSIONS = {
    ".py"
}

def get_python_files(repo_path):

    source_files = []

    for root, dirs, files in os.walk(repo_path):

        dirs[:] = [
            d
            for d in dirs
            if d not in IGNORE_DIRS
            and not d.startswith(".")
        ]

        for file in files:

            if file.startswith("."):
                continue

            extension = os.path.splitext(file)[1]

            if extension in SUPPORTED_EXTENSIONS:

                source_files.append(
                    os.path.join(root, file)
                )

    return source_files
# def get_python_files(repo_path):

#     python_files = []

#     for root, dirs, files in os.walk(repo_path):
#         dirs[:] = [
#         d
#         for d in dirs
#         if d not in IGNORE_DIRS
#         and not d.startswith(".")
#         ]

#         for file in files:

#             if file.endswith(".py"):

#                 full_path = os.path.join(root, file)

#                 # relative_path = os.path.relpath(full_path,repo_path)

#                 python_files.append(full_path)
#                 # python_files.append(relative_path)

#     return python_files