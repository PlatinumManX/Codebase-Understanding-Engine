import requests
import httpx

def login():

    requests.post(
        "https://api.example.com"
    )

    httpx.get(
        "https://google.com"
    )
class User:
    pass

class Admin(User):
    pass

class SuperAdmin(Admin):
    pass