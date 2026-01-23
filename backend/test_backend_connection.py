#!/usr/bin/env python3
"""
Test Backend Connection - Comprehensive Backend Testing
=====================================================
This test file comprehensively checks all backend components including:
- FastAPI server connectivity
- AI module imports and initialization  
- Supabase database connection
- Configuration validation
- All API endpoints availability
- Environment variables validation
"""

import requests
import sys
import os
from urllib.parse import urljoin

# Add backend to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Backend configuration
BASE_URL = "http://localhost:8000"
TIMEOUT = 10  # seconds


def test_config_validation():
    """Test environment configuration and validation"""
    print("\n🔍 Testing configuration validation...")
    
    try:
        from config import validate_config, AI_MODE
        
        validation_result = validate_config()
        
        if not validation_result.get("missing"):
            print("✅ All required environment variables are configured")
            print(f"   AI Mode: {AI_MODE}")
            return True
        else:
            missing = validation_result.get("missing", [])
            print(f"⚠️  Missing environment variables: {', '.join(missing)}")
            print("   Note: This may cause AI features to fail")
            return False
            
    except ImportError as e:
        print(f"❌ Could not import config module: {e}")
        return False
    except Exception as e:
        print(f"❌ Configuration validation error: {e}")
        return False


def test_supabase_connection():
    """Test Supabase database connection"""
    print("\n🔍 Testing Supabase connection...")
    
    try:
        from services.supabase_service import supabase
        
        if supabase is None:
            print("❌ Supabase client is None - check configuration")
            return False
        
        # Try a simple health check query
        result = supabase.table("ai_logs").select("id").limit(1).execute()
        
        if result:
            print("✅ Supabase connection successful")
            print(f"   Connected to table: ai_logs")
            return True
        else:
            print("⚠️  Supabase query returned no result")
            return False
            
    except ImportError as e:
        print(f"❌ Could not import Supabase service: {e}")
        return False
    except Exception as e:
        print(f"⚠️  Supabase connection test failed: {str(e)}")
        print("   This might be normal if tables don't exist yet")
        return False


def test_ai_module_imports():
    """Test AI module components can be imported"""
    print("\n🔍 Testing AI module imports...")
    
    ai_components = {
        "stt": "AI.stt",
        "llm": "AI.llm", 
        "tts": "AI.tts",
        "pipeline": "AI.pipeline",
        "profiles": "AI.profiles"
    }
    
    results = {}
    
    for component_name, module_path in ai_components.items():
        try:
            __import__(module_path)
            print(f"✅ {component_name.upper()} module imported successfully")
            results[component_name] = True
        except ImportError as e:
            print(f"❌ Failed to import {component_name.upper()} module: {e}")
            results[component_name] = False
        except Exception as e:
            print(f"⚠️  Error importing {component_name.upper()} module: {e}")
            results[component_name] = False
    
    # Test main AI module
    try:
        import AI
        print("✅ Main AI module imported successfully")
        results["main_ai"] = True
    except Exception as e:
        print(f"❌ Failed to import main AI module: {e}")
        results["main_ai"] = False
    
    return results


def test_service_imports():
    """Test service layer imports"""
    print("\n🔍 Testing service layer imports...")
    
    services = {
        "ai_service": "services.ai_service",
        "auth_service": "services.auth_service",
        "content_service": "services.content_service", 
        "supabase_service": "services.supabase_service"
    }
    
    results = {}
    
    for service_name, module_path in services.items():
        try:
            __import__(module_path)
            print(f"✅ {service_name} imported successfully")
            results[service_name] = True
        except ImportError as e:
            print(f"❌ Failed to import {service_name}: {e}")
            results[service_name] = False
        except Exception as e:
            print(f"⚠️  Error importing {service_name}: {e}")
            results[service_name] = False
    
    return results


def test_route_imports():
    """Test route modules can be imported"""
    print("\n🔍 Testing route imports...")
    
    routes = {
        "ai_routes": "routes.ai_routes",
        "auth_routes": "routes.auth_routes",
        "content_routes": "routes.content_routes",
        "user_routes": "routes.user_routes"
    }
    
    results = {}
    
    for route_name, module_path in routes.items():
        try:
            __import__(module_path)
            print(f"✅ {route_name} imported successfully")
            results[route_name] = True
        except ImportError as e:
            print(f"❌ Failed to import {route_name}: {e}")
            results[route_name] = False
        except Exception as e:
            print(f"⚠️  Error importing {route_name}: {e}")
            results[route_name] = False
    
    return results


def test_server_running():
    """Test if the server is running and responding"""
    print("🔍 Testing if backend server is running...")
    
    try:
        # Try to connect to the root endpoint
        response = requests.get(BASE_URL, timeout=TIMEOUT)
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ Server is running! Status: {response.status_code}")
            print(f"   Message: {response_data.get('message', 'N/A')}")
            print(f"   Status: {response_data.get('status', 'N/A')}")
            return True
        else:
            print(f"⚠️  Server responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running or not accessible")
        return False
    except requests.exceptions.Timeout:
        print("❌ Server response timeout")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def test_health_endpoint():
    """Test the health check endpoint"""
    print("\n🔍 Testing health check endpoint...")
    
    try:
        health_url = urljoin(BASE_URL, "/health")
        response = requests.get(health_url, timeout=TIMEOUT)
        
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Health endpoint accessible")
            print(f"   Status: {health_data.get('status', 'N/A')}")
            print(f"   Message: {health_data.get('message', 'N/A')}")
            return True
        else:
            print(f"⚠️  Health endpoint returned status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Could not access health endpoint: {e}")
        return False


def test_docs_endpoint():
    """Test if the FastAPI docs endpoint is accessible"""
    print("\n🔍 Testing API documentation endpoint...")
    
    try:
        docs_url = urljoin(BASE_URL, "/docs")
        response = requests.get(docs_url, timeout=TIMEOUT)
        
        if response.status_code == 200:
            print("✅ API docs endpoint accessible at /docs")
            return True
        else:
            print(f"⚠️  API docs returned status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Could not access API docs: {e}")
        return False


def test_openapi_endpoint():
    """Test if the OpenAPI schema endpoint is accessible"""
    print("\n🔍 Testing OpenAPI schema endpoint...")
    
    try:
        openapi_url = urljoin(BASE_URL, "/openapi.json")
        response = requests.get(openapi_url, timeout=TIMEOUT)
        
        if response.status_code == 200:
            schema = response.json()
            print("✅ OpenAPI schema accessible")
            print(f"   API Title: {schema.get('info', {}).get('title', 'Unknown')}")
            print(f"   API Version: {schema.get('info', {}).get('version', 'Unknown')}")
            return True
        else:
            print(f"⚠️  OpenAPI schema returned status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Could not access OpenAPI schema: {e}")
        return False


def test_cors_headers():
    """Test if CORS headers are properly configured"""
    print("\n🔍 Testing CORS configuration...")
    
    try:
        response = requests.get(BASE_URL, timeout=TIMEOUT)
        headers = response.headers
        
        cors_headers = {
            'Access-Control-Allow-Origin': headers.get('access-control-allow-origin'),
            'Access-Control-Allow-Methods': headers.get('access-control-allow-methods'),
            'Access-Control-Allow-Headers': headers.get('access-control-allow-headers'),
        }
        
        if any(cors_headers.values()):
            print("✅ CORS headers detected:")
            for header, value in cors_headers.items():
                if value:
                    print(f"   {header}: {value}")
            return True
        else:
            print("⚠️  No CORS headers found")
            return False
            
    except Exception as e:
        print(f"❌ Could not check CORS headers: {e}")
        return False


def test_endpoint_availability():
    """Test if key API endpoints exist (without calling them)"""
    print("\n🔍 Testing endpoint availability (HEAD requests only)...")
    
    endpoints = [
        "/health",
        "/ai/health",
        "/ai/children", 
        "/ai/interact",
        "/ai/text",
        "/ai/greeting/child_001",
        "/ai/child/child_001",
        "/auth/register",
        "/auth/login",
        "/users/profile",
        "/content/lessons"
    ]
    
    results = {}
    
    for endpoint in endpoints:
        try:
            url = urljoin(BASE_URL, endpoint)
            # Use HEAD request to avoid triggering the actual endpoint logic
            response = requests.head(url, timeout=TIMEOUT)
            
            if response.status_code in [200, 405, 422]:  # 405 = Method Not Allowed, 422 = Validation Error
                print(f"✅ Endpoint {endpoint} exists")
                results[endpoint] = True
            elif response.status_code == 404:
                print(f"❌ Endpoint {endpoint} not found")
                results[endpoint] = False
            else:
                print(f"⚠️  Endpoint {endpoint} returned status: {response.status_code}")
                results[endpoint] = True  # Consider it available but with issues
                
        except Exception as e:
            print(f"❌ Could not reach endpoint {endpoint}: {e}")
            results[endpoint] = False
    
    return results


def run_all_tests():
    """Run all connectivity and integration tests"""
    print("=" * 80)
    print("🚀 COMPREHENSIVE BACKEND TEST SUITE")
    print("=" * 80)
    print(f"Testing backend at: {BASE_URL}")
    print(f"Timeout: {TIMEOUT} seconds")
    print("=" * 80)
    
    test_categories = [
        ("Server Connectivity", test_server_running),
        ("Health Check", test_health_endpoint),
        ("Configuration", test_config_validation),
        ("Supabase Connection", test_supabase_connection),
        ("AI Module Imports", test_ai_module_imports),
        ("Service Layer", test_service_imports),
        ("Route Layer", test_route_imports),
        ("API Documentation", test_docs_endpoint),
        ("OpenAPI Schema", test_openapi_endpoint),
        ("CORS Configuration", test_cors_headers),
        ("Endpoint Availability", test_endpoint_availability),
    ]
    
    results = []
    category_results = {}
    
    for category_name, test_func in test_categories:
        try:
            print(f"\n{'='*60}")
            print(f"🧪 TESTING: {category_name.upper()}")
            print(f"{'='*60}")
            
            result = test_func()
            results.append(result)
            category_results[category_name] = result
            
        except Exception as e:
            print(f"❌ Test {category_name} failed with error: {e}")
            results.append(False)
            category_results[category_name] = False
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 COMPREHENSIVE TEST SUMMARY")
    print("=" * 80)
    
    # Calculate overall scores
    passed_categories = sum(1 for r in results if r is True or (isinstance(r, dict) and any(r.values())))
    total_categories = len(test_categories)
    
    print(f"Test Categories Passed: {passed_categories}/{total_categories}")
    
    # Detailed breakdown
    print("\n📋 Detailed Results:")
    for category, result in category_results.items():
        if result is True:
            status = "✅ PASS"
        elif isinstance(result, dict):
            passed_items = sum(1 for v in result.values() if v)
            total_items = len(result)
            if passed_items == total_items:
                status = "✅ PASS"
            elif passed_items > 0:
                status = f"⚠️  PARTIAL ({passed_items}/{total_items})"
            else:
                status = "❌ FAIL"
        else:
            status = "❌ FAIL"
        
        print(f"   {category:.<40} {status}")
    
    # Critical vs Non-Critical Assessment
    critical_tests = ["Server Connectivity", "Health Check", "Route Layer"]
    critical_passed = all(category_results.get(test, False) for test in critical_tests)
    
    print(f"\n🔥 Critical Systems: {'✅ OPERATIONAL' if critical_passed else '❌ ISSUES DETECTED'}")
    
    if critical_passed and passed_categories >= total_categories * 0.7:  # 70% pass rate
        print("\n🎉 Backend is ready for development!")
        return True
    elif critical_passed:
        print("\n⚠️  Backend is functional but has some issues.")
        return True
    else:
        print("\n💥 Critical backend issues detected. Fix before proceeding.")
        return False


if __name__ == "__main__":
    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⛔ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Unexpected error during testing: {e}")
        sys.exit(1)