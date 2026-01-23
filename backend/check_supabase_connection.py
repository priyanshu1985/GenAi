#!/usr/bin/env python3
"""
Supabase Connection Checker
Simple file to test and verify Supabase database connection
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseConnectionChecker:
    def __init__(self):
        self.supabase_client = None
        self.connection_status = False
        
    def check_environment(self):
        """Check if environment variables are set"""
        print("🔍 Checking Environment Variables...")
        print("-" * 30)
        
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not url:
            print("❌ SUPABASE_URL not found in environment")
            return False
            
        if not key:
            print("❌ SUPABASE_SERVICE_ROLE_KEY not found in environment")
            return False
            
        print(f"✅ SUPABASE_URL: {url}")
        print(f"✅ SUPABASE_KEY: {key[:20]}...")
        return True
    
    def test_import(self):
        """Test if supabase package can be imported"""
        print("\n🔍 Testing Supabase Package Import...")
        print("-" * 30)
        
        try:
            from supabase import create_client
            print("✅ Supabase package imported successfully")
            return True
        except ImportError as e:
            print(f"❌ Failed to import supabase: {e}")
            print("   Run: pip install supabase")
            return False
    
    def create_client(self):
        """Create Supabase client"""
        print("\n🔍 Creating Supabase Client...")
        print("-" * 30)
        
        try:
            from supabase import create_client
            
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            
            self.supabase_client = create_client(url, key)
            print("✅ Supabase client created successfully")
            return True
            
        except Exception as e:
            print(f"❌ Failed to create client: {e}")
            return False
    
    def test_connection(self):
        """Test actual database connection"""
        print("\n🔍 Testing Database Connection...")
        print("-" * 30)
        
        if not self.supabase_client:
            print("❌ No Supabase client available")
            return False
        
        try:
            # Try a simple query to test connection
            response = self.supabase_client.table('users').select('count', count='exact').execute()
            print("✅ Database connection successful!")
            print(f"   Users table count: {response.count if hasattr(response, 'count') else 'N/A'}")
            self.connection_status = True
            return True
            
        except Exception as e:
            error_msg = str(e)
            
            # Check if it's a table not found error (connection is working)
            if "Could not find the table" in error_msg:
                print("✅ Database connection successful!")
                print("   (Users table needs to be created)")
                self.connection_status = True
                return True
            
            # Check if it's a permission error (connection is working)
            elif "permission" in error_msg.lower() or "policy" in error_msg.lower():
                print("✅ Database connection successful!")
                print("   (Need to setup Row Level Security policies)")
                self.connection_status = True
                return True
            
            else:
                print(f"❌ Database connection failed: {e}")
                return False
    
    def test_service_import(self):
        """Test if our supabase service can be imported"""
        print("\n🔍 Testing Supabase Service Import...")
        print("-" * 30)
        
        try:
            from services.supabase_service import supabase
            print("✅ Supabase service imported successfully")
            
            # Test if service client works
            try:
                response = supabase.table('users').select('count', count='exact').execute()
                print("✅ Service client is working!")
                return True
            except Exception as e:
                if "Could not find" in str(e) or "permission" in str(e).lower():
                    print("✅ Service client is working!")
                    return True
                else:
                    print(f"⚠️  Service client issue: {e}")
                    return False
                    
        except Exception as e:
            print(f"❌ Failed to import supabase service: {e}")
            return False
    
    def run_full_check(self):
        """Run complete connection check"""
        print("🚀 SUPABASE CONNECTION CHECKER")
        print("=" * 40)
        
        checks = [
            ("Environment Variables", self.check_environment),
            ("Package Import", self.test_import),
            ("Client Creation", self.create_client),
            ("Database Connection", self.test_connection),
            ("Service Import", self.test_service_import)
        ]
        
        passed = 0
        total = len(checks)
        
        for check_name, check_func in checks:
            if check_func():
                passed += 1
            else:
                # If critical checks fail, stop
                if check_name in ["Environment Variables", "Package Import"]:
                    print(f"\n❌ Critical check '{check_name}' failed. Stopping...")
                    break
        
        # Final report
        print("\n" + "=" * 40)
        print("📊 CONNECTION CHECK RESULTS")
        print("=" * 40)
        print(f"Checks Passed: {passed}/{total}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if self.connection_status:
            print("\n🎉 SUPABASE CONNECTION IS WORKING!")
            print("✅ Your backend can communicate with Supabase")
            
            print("\n📝 Next Steps:")
            print("   1. Create 'users' table in Supabase Dashboard")
            print("   2. Set up Row Level Security (RLS)")
            print("   3. Create authentication policies")
            print("   4. Test your API endpoints")
            
        elif passed >= 3:
            print("\n✅ CONNECTION MOSTLY WORKING!")
            print("   Minor issues that can be resolved")
            
        else:
            print("\n❌ CONNECTION ISSUES FOUND!")
            print("   Please fix the errors above")
            
        return self.connection_status

def main():
    """Main function"""
    checker = SupabaseConnectionChecker()
    success = checker.run_full_check()
    
    if success:
        print("\n🔗 Connection Details:")
        print(f"   URL: {os.getenv('SUPABASE_URL')}")
        print(f"   Project: {os.getenv('SUPABASE_URL', '').split('.')[-3] if os.getenv('SUPABASE_URL') else 'Unknown'}")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)