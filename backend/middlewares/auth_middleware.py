from fastapi import Request, HTTPException
from services.auth_service import get_user_from_token

def role_required(allowed_roles: list):
    async def wrapper(request: Request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            raise HTTPException(status_code=401, detail="Token missing")

        token = auth_header.replace("Bearer ", "")
        user = get_user_from_token(token)

        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")

        if user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")

        request.state.user = user
        return user
    return wrapper