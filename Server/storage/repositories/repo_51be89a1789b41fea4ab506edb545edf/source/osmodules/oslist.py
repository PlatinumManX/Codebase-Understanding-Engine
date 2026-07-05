import os
folders=os.listdir("data") #It will tell us what are the folders in a data file
print(folders) #It simply provide us the list of folder in a data file
print(os.getcwd())#It tell us that where we are working or say which directory
# os.chdir("/Users") #By this way we can change the directory of our folders
# print(os.getcwd()) #Now we have changed the directory then the below data will not work because the main folder directory has been changed
# for folder in folders:
#     print(folder)#By this way we can print the each folders
#     print(os.listdir(f"data/{folder}")) #It says that print the folders in a folders