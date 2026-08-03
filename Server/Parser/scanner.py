import os

def get_python_files(repo_path):

    python_files = []

    for root, dirs, files in os.walk(repo_path):

        for file in files:

            if file.endswith(".py"):

                full_path = os.path.join(root, file)

                # relative_path = os.path.relpath(full_path,repo_path)

                python_files.append(full_path)
                # python_files.append(relative_path)

    return python_files