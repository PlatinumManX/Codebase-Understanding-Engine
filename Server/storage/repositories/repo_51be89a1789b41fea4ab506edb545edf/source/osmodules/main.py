import os

# if(not os.path.exists("data")): #If we didn't write here the if condition then it will jump into a checking that data folder is alredy maked so it won't be work but due to condition that we hav make so it will create if the daat folder doesn't exist then it will execute further
#     os.mkdir("data") #By this way we can create a new folder called data
    #In case of changing the folder name we don't need the above code it only need in case of making folders
for i in range(0,100):
    # os.mkdir(f"data/Day{i+1}") #By this wway we can make many folder just by using for loop and it will only print if the folder previous doesn't exist
    # os.rename(f"data/Day{i+1}",f"data/Tutorial{i+1}") #it work as rename(sourse folder, changed folder name) also here the data written here is shown that where we have to make that folders
    os.rename(f"data/Tutorial{i+1}",f"data/Tutorial {i+1}") #To make further changes we have to clear previous one code of changing