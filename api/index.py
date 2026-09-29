"""
Vercel serverless function entry point for FastAPI backend
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set production environment flag
os.environ["VERCEL"] = "1"

from server import app

# Vercel expects the handler to be named 'handler' or 'app'
handler = app
