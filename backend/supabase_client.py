"""
Supabase client configuration and utility functions for Marquee 2.0
"""
import os
from supabase import create_client, Client
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# Initialize Supabase client (for user operations)
supabase: Optional[Client] = None
supabase_admin: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Supabase client initialized successfully")
else:
    logger.warning("Supabase credentials not found. Profile features will be disabled.")

if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    logger.info("Supabase admin client initialized successfully")


def get_supabase() -> Client:
    """Get the Supabase client instance"""
    if not supabase:
        raise RuntimeError("Supabase client not initialized. Check your environment variables.")
    return supabase


def get_supabase_admin() -> Client:
    """Get the Supabase admin client instance (with service role key)"""
    if not supabase_admin:
        raise RuntimeError("Supabase admin client not initialized. Check your environment variables.")
    return supabase_admin
