#!/usr/bin/env python3
"""
Comprehensive Backend & Supabase Connection Test
Tests all aspects of the backend including Supabase connection, auth, and API endpoints
"""

import sys
import os
import asyncio
import requests
import json
import time
import subprocess
import threading
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ComprehensiveBackendTester:
    def __init__(self):
        self.base_url = "http://127.0.0.1:8000"
        self.server_process = None
        self.test_results = []
        
    def log_test(self, test_name: str, status: str, message: str = ""):
        """Log test results with color coding"""
        result = {
            "test": test_name,
            "status": status,
            "message": message
        }
        self.test_results.append(result)
        
        # Color coding
        if status == "PASS":
            color_code = "\033[92m"  # Green
        elif status == "WARN":
            color_code = "\033[93m"  # Yellow
        else:
            color_code = "\033[91m"  # Red
            
        reset_code = "\033[0m"
        print(f"{color_code}[{status}]{reset_code} {test_name}: {message}")

    def test_environment_setup(self):
        """Test environment variables and configuration"""
        print("\n" + "="*60)
        print("🔧 TESTING ENVIRONMENT SETUP")
        print("="*60)
        
        # Test environment variables
        required_vars = {
            'SUPABASE_URL': os.getenv('SUPABASE_URL'),
            'SUPABASE_SERVICE_ROLE_KEY': os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
            'JWT_SECRET': os.getenv('JWT_SECRET')
        }
        
        for var_name, var_value in required_vars.items():
            if var_value:
                display_value = var_value[:15] + "..." if len(var_value) > 15 else var_value
                self.log_test(f"Env Var: {var_name}", "PASS", f"Set: {display_value}")
            else:
                self.log_test(f"Env Var: {var_name}", "FAIL", "Not set")

    def test_imports_and_dependencies(self):
        """Test all required imports"""
        print("\n" + "="*60)
        print("📦 TESTING IMPORTS & DEPENDENCIES")
        print("="*60)
        
        imports_to_test = [
            ('fastapi', 'FastAPI'),
            ('uvicorn', 'Uvicorn'),
            ('dotenv', 'python-dotenv'),
            ('supabase', 'Supabase'),
            ('jwt', 'PyJWT')
        ]
        
        for module_name, display_name in imports_to_test:
            try:
                module = __import__(module_name)
                version = getattr(module, '__version__', 'Unknown')
                self.log_test(f"Import: {display_name}", "PASS", f"Version: {version}")
            except ImportError as e:
                self.log_test(f"Import: {display_name}", "FAIL", str(e))

    def test_config_loading(self):
        """Test configuration file loading"""
        print("\n" + "="*60)
        print("⚙️  TESTING CONFIGURATION LOADING")
        print("="*60)
        
        try:
            from config import SUPABASE_URL, SUPABASE_KEY, JWT_SECRET
            self.log_test("Config Loading", "PASS", "All config variables loaded")
            
            # Validate config values
            if SUPABASE_URL and SUPABASE_URL.startswith('https://'):
                self.log_test("Supabase URL Format", "PASS", "Valid HTTPS URL")
            else:
                self.log_test("Supabase URL Format", "FAIL", "Invalid or missing URL")
                
            if SUPABASE_KEY and len(SUPABASE_KEY) > 50:
                self.log_test("Supabase Key", "PASS", "Service key present")
            else:
                self.log_test("Supabase Key", "FAIL", "Service key missing or invalid")
                
            if JWT_SECRET and len(JWT_SECRET) > 10:
                self.log_test("JWT Secret", "PASS", "JWT secret configured")
            else:
                self.log_test("JWT Secret", "FAIL", "JWT secret too short or missing")
                
        except Exception as e:
            self.log_test("Config Loading", "FAIL", str(e))

    def test_supabase_connection(self):
        """Test Supabase database connection"""
        print("\n" + "="*60)
        print("🗄️  TESTING SUPABASE CONNECTION")
        print("="*60)
        
        try:
            from supabase import create_client
            
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            
            if not url or not key:
                self.log_test("Supabase Credentials", "FAIL", "Missing credentials")
                return False
            
            # Create client
            supabase = create_client(url, key)
            self.log_test("Supabase Client", "PASS", "Client created successfully")
            
            # Test connection by trying to access users table
            try:
                response = supabase.table("users").select("*").limit(1).execute()
                self.log_test("Users Table Access", "PASS", "Successfully connected to users table")
                
                # Check table structure
                if response.data:
                    sample_user = response.data[0]
                    columns = list(sample_user.keys())
                    self.log_test("Users Table Structure", "PASS", f"Columns: {', '.join(columns)}")
                else:
                    self.log_test("Users Table Data", "WARN", "Table exists but no data")
                    
                return True
                
            except Exception as e:
                error_msg = str(e)
                if "Could not find the table" in error_msg:
                    self.log_test("Users Table", "FAIL", "Users table doesn't exist")
                elif "permission" in error_msg.lower():
                    self.log_test("Users Table", "WARN", "Permission issue - check RLS policies")
                else:
                    self.log_test("Users Table", "FAIL", f"Error: {error_msg}")
                return False
                
        except Exception as e:
            self.log_test("Supabase Connection", "FAIL", str(e))
            return False

    def test_services_import(self):
        """Test backend services import"""
        print("\n" + "="*60)
        print("🔧 TESTING BACKEND SERVICES")
        print("="*60)
        
        services_to_test = [
            ('services.supabase_service', 'Supabase Service'),
            ('services.auth_service', 'Auth Service'),
            ('middlewares.auth_middleware', 'Auth Middleware'),
            ('routes.user_routes', 'User Routes')
        ]
        
        for service_path, service_name in services_to_test:
            try:
                __import__(service_path)
                self.log_test(f"{service_name}", "PASS", "Import successful")
            except ImportError as e:
                self.log_test(f"{service_name}", "FAIL", str(e))

    def test_fastapi_app(self):
        """Test FastAPI application creation"""
        print("\n" + "="*60)
        print("🚀 TESTING FASTAPI APPLICATION")
        print("="*60)
        
        try:
            from main import app
            self.log_test("FastAPI App Creation", "PASS", "App created successfully")
            
            # Check routes
            routes = []
            for route in app.routes:
                if hasattr(route, 'path') and hasattr(route, 'methods'):
                    methods = ', '.join(route.methods) if route.methods else 'GET'
                    routes.append(f"{methods} {route.path}")
            
            if routes:
                self.log_test("API Routes", "PASS", f"Found {len(routes)} routes")
                for route in routes:
                    print(f"    📍 {route}")
            else:
                self.log_test("API Routes", "WARN", "No routes found")
                
            return True
            
        except Exception as e:
            self.log_test("FastAPI App Creation", "FAIL", str(e))
            return False

    def test_auth_functionality(self):
        """Test authentication functionality"""
        print("\n" + "="*60)
        print("🔐 TESTING AUTHENTICATION")
        print("="*60)
        
        try:
            from services.auth_service import get_user_from_token
            
            # Test with invalid token
            result = get_user_from_token("invalid_token")
            if result is None:
                self.log_test("Invalid Token Handling", "PASS", "Correctly rejects invalid tokens")
            else:
                self.log_test("Invalid Token Handling", "FAIL", "Should return None for invalid tokens")
            
            # Test JWT functionality
            try:
                import jwt
                from config import JWT_SECRET
                
                # Create a test token
                test_payload = {"user_id": "test-user-123", "role": "parent"}
                test_token = jwt.encode(test_payload, JWT_SECRET, algorithm="HS256")
                
                # Decode it back
                decoded = jwt.decode(test_token, JWT_SECRET, algorithms=["HS256"])
                if decoded["user_id"] == "test-user-123":
                    self.log_test("JWT Token Creation", "PASS", "JWT encoding/decoding works")
                else:
                    self.log_test("JWT Token Creation", "FAIL", "JWT payload mismatch")
                    
            except Exception as e:
                self.log_test("JWT Token Creation", "FAIL", str(e))
                
        except Exception as e:
            self.log_test("Auth Service", "FAIL", str(e))

    def start_server(self):
        """Start FastAPI server for endpoint testing"""
        print("\n" + "="*60)
        print("🚀 STARTING FASTAPI SERVER")
        print("="*60)
        
        try:
            cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
            self.server_process = subprocess.Popen(
                cmd,
                cwd=os.path.dirname(os.path.abspath(__file__)),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait for server to start
            print("⏳ Waiting for server to start...")
            time.sleep(3)
            
            # Test if server is running
            try:
                response = requests.get(f"{self.base_url}/docs", timeout=5)
                if response.status_code == 200:
                    self.log_test("Server Startup", "PASS", f"Server running at {self.base_url}")
                    return True
                else:
                    self.log_test("Server Startup", "FAIL", f"Server responded with {response.status_code}")
                    return False
            except requests.exceptions.RequestException as e:
                self.log_test("Server Startup", "FAIL", f"Connection failed: {e}")
                return False
                
        except Exception as e:
            self.log_test("Server Startup", "FAIL", str(e))
            return False

    def test_api_endpoints(self):
        """Test API endpoints"""
        print("\n" + "="*60)
        print("🌐 TESTING API ENDPOINTS")
        print("="*60)
        
        endpoints_to_test = [
            ("/docs", "GET", "API Documentation", 200),
            ("/openapi.json", "GET", "OpenAPI Schema", 200),
            ("/api/parent-data", "GET", "Parent Data (Protected)", 401),
            ("/api/teacher-data", "GET", "Teacher Data (Protected)", 401),
            ("/api/admin-data", "GET", "Admin Data (Protected)", 401)
        ]
        
        for endpoint, method, description, expected_status in endpoints_to_test:
            try:
                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                    
                    if response.status_code == expected_status:
                        if expected_status == 200:
                            self.log_test(f"{method} {endpoint}", "PASS", f"{description} - Working")
                        elif expected_status == 401:
                            self.log_test(f"{method} {endpoint}", "PASS", f"{description} - Properly protected")
                    else:
                        self.log_test(f"{method} {endpoint}", "WARN", 
                                    f"{description} - Status: {response.status_code} (expected: {expected_status})")
                        
            except Exception as e:
                self.log_test(f"{method} {endpoint}", "FAIL", f"{description} - Error: {str(e)}")

    def test_database_operations(self):
        """Test basic database operations"""
        print("\n" + "="*60)
        print("💾 TESTING DATABASE OPERATIONS")
        print("="*60)
        
        try:
            from services.supabase_service import supabase
            
            # Test reading from users table
            try:
                response = supabase.table("users").select("*").limit(3).execute()
                self.log_test("Database Read", "PASS", f"Successfully read from users table")
                
                if response.data:
                    self.log_test("Users Data", "PASS", f"Found {len(response.data)} users")
                else:
                    self.log_test("Users Data", "WARN", "No users in database")
                    
            except Exception as e:
                self.log_test("Database Read", "FAIL", f"Error reading users: {e}")
            
            # Test connection with different approach
            try:
                # Try a simple count operation
                response = supabase.table("users").select("*", count="exact").execute()
                count = response.count if hasattr(response, 'count') else 'Unknown'
                self.log_test("Database Count", "PASS", f"Users count operation successful")
                
            except Exception as e:
                self.log_test("Database Count", "WARN", f"Count operation failed: {e}")
                
        except Exception as e:
            self.log_test("Database Operations", "FAIL", str(e))

    def stop_server(self):
        """Stop the FastAPI server"""
        if self.server_process:
            self.server_process.terminate()
            try:
                self.server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.server_process.kill()
            print("\n🛑 Server stopped.")

    def generate_final_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*70)
        print("📊 COMPREHENSIVE TEST REPORT")
        print("="*70)
        
        total_tests = len(self.test_results)
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        failed = len([r for r in self.test_results if r["status"] == "FAIL"])
        warnings = len([r for r in self.test_results if r["status"] == "WARN"])
        
        print(f"📈 Test Statistics:")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed}")
        print(f"   ❌ Failed: {failed}")
        print(f"   ⚠️  Warnings: {warnings}")
        print(f"   📊 Success Rate: {(passed/total_tests)*100:.1f}%")
        
        # Categorize results
        categories = {
            "Critical Failures": [r for r in self.test_results if r["status"] == "FAIL"],
            "Warnings": [r for r in self.test_results if r["status"] == "WARN"],
            "Successes": [r for r in self.test_results if r["status"] == "PASS"]
        }
        
        for category, results in categories.items():
            if results and category != "Successes":
                print(f"\n{category}:")
                for result in results:
                    print(f"   • {result['test']}: {result['message']}")
        
        # Overall assessment
        print(f"\n🎯 OVERALL ASSESSMENT:")
        if failed == 0 and warnings <= 2:
            print("   🎉 EXCELLENT! Your backend is fully functional!")
            status = "EXCELLENT"
        elif failed <= 2 and warnings <= 5:
            print("   ✅ GOOD! Minor issues that can be easily fixed.")
            status = "GOOD"
        elif failed <= 5:
            print("   ⚠️  NEEDS IMPROVEMENT! Several issues need attention.")
            status = "NEEDS_WORK"
        else:
            print("   ❌ CRITICAL ISSUES! Major problems need to be resolved.")
            status = "CRITICAL"
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        if failed > 0:
            print("   1. Fix critical failures first (marked as FAIL)")
            print("   2. Ensure all environment variables are set correctly")
            print("   3. Verify Supabase connection and table structure")
            print("   4. Check authentication flow implementation")
        
        if warnings > 0:
            print("   5. Address warnings for better functionality")
            print("   6. Consider implementing missing optional features")
        
        print("   7. Test with real user data")
        print("   8. Set up proper error handling")
        print("   9. Configure CORS for frontend integration")
        print("   10. Add comprehensive logging")
        
        return status

    def run_comprehensive_test(self):
        """Run the complete test suite"""
        print("🚀 COMPREHENSIVE BACKEND & SUPABASE TEST SUITE")
        print("=" * 70)
        print("Testing all aspects of your backend setup...")
        
        try:
            # Run all tests
            self.test_environment_setup()
            self.test_imports_and_dependencies()
            self.test_config_loading()
            self.test_supabase_connection()
            self.test_services_import()
            self.test_fastapi_app()
            self.test_auth_functionality()
            self.test_database_operations()
            
            # Test with running server
            if self.start_server():
                self.test_api_endpoints()
                self.stop_server()
            
            # Generate final report
            status = self.generate_final_report()
            
            return status in ["EXCELLENT", "GOOD"]
            
        except KeyboardInterrupt:
            print("\n\n⚠️ Test interrupted by user.")
            self.stop_server()
            return False
        except Exception as e:
            print(f"\n\n💥 Unexpected error: {e}")
            self.stop_server()
            return False

def main():
    """Main function"""
    tester = ComprehensiveBackendTester()
    success = tester.run_comprehensive_test()
    
    print(f"\n🏁 Test completed. {'SUCCESS' if success else 'ISSUES FOUND'}")
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)