def success(data):
    """Return a success response wrapper"""
    return {
        "success": True,
        "data": data
    }

def error(message: str, code: int = 400):
    """Return an error response wrapper"""
    return {
        "success": False,
        "error": message,
        "code": code
    }
