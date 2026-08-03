from db import query_db
# auth.py

from services.auth_services import authenticate
async def login(username, password):
    await authenticate()
    await generate_token()

async def authenticate():
    pass

async def generate_token():
    pass