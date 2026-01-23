"""
Utils Package
Common utilities for the backend application
"""

def success(data=None, message="Success"):
    """
    Standard success response format
    """
    return {
        "success": True,
        "message": message,
        "data": data
    }

def error(message="An error occurred", status_code=500, details=None):
    """
    Standard error response format
    """
    return {
        "success": False,
        "message": message,
        "status_code": status_code,
        "details": details
    }