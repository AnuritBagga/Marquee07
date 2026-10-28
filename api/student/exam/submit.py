from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle exam submission"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            submission = json.loads(post_data)
            
            print(f"Received submission for exam: {submission.get('examId')}")
            
            # For now, just return success
            # In production, you would save to Supabase here
            
            # Calculate simple score (count correct answers)
            answers = submission.get('answers', {})
            total_questions = len(answers)
            
            # For demo: assume all answers are correct
            # In production, you would check against correct answers
            score = total_questions
            percentage = 100 if total_questions > 0 else 0
            
            result = {
                "success": True,
                "message": "Exam submitted successfully",
                "result": {
                    "examId": submission.get('examId'),
                    "studentName": submission.get('studentName'),
                    "score": score,
                    "totalQuestions": total_questions,
                    "percentage": percentage,
                    "passed": percentage >= 60,
                    "submittedAt": submission.get('submittedAt')
                }
            }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            print(f"Error: {str(e)}")
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                "success": False,
                "error": str(e)
            }
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
