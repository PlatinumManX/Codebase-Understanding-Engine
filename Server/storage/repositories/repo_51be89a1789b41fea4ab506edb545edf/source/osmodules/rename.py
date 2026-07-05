import os
for i in range(0,100):
    # os.mkdir(f"data/Day{i+1}") #By this wway we can make many folder just by using for loop and it will only print if the folder previous doesn't exist
    # os.rename(f"data/Day{i+1}",f"data/Tutorial{i+1}") #it work as rename(sourse folder, changed folder name) also here the data written here is shown that where we have to make that folders
    os.rename(f"data/Tutorial{i+1}",f"data/Tutorial {i+1}") #To make further changes we have to clear previous one code of changing