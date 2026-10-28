from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle exam submission"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            submission = json.loads(post_data.decode('utf-8'))
            
            print(f"✅ Received submission for exam: {submission.get('examId')}")
            print(f"Student: {submission.get('studentName')}")
            print(f"Answers: {len(submission.get('answers', {}))}")
            
            # Get submission data
            exam_id = submission.get('examId', 'unknown')
            student_name = submission.get('studentName', 'Unknown')
            answers = submission.get('answers', {})
            
            # Calculate score
            # For demo: just count answered questions
            # In production: check against correct answers from database
            total_questions = len(answers)
            score = total_questions  # Assume all correct for demo
            percentage = 100 if total_questions > 0 else 0
            
            # Create result
            result = {
                "success": True,
                "message": "Exam submitted successfully",
                "result": {
                    "examId": exam_id,
                    "studentName": student_name,
                    "score": score,
                    "totalQuestions": total_questions,
                    "percentage": percentage,
                    "passed": percentage >= 60,
                    "submittedAt": submission.get('submittedAt')
                }
            }
            
            print(f"✅ Submission processed successfully")
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = json.dumps(result)
            self.wfile.write(response_data.encode('utf-8'))
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {str(e)}")
            self.send_error_response(400, f"Invalid JSON: {str(e)}")
            
        except Exception as e:
            print(f"❌ Server error: {str(e)}")
            self.send_error_response(500, str(e))
    
    def send_error_response(self, code, message):
        """Send error response"""
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            "success": False,
            "error": message
        }
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_GET(self):
        """Handle GET requests - return API info"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        info = {
            "api": "Exam Submission API",
            "version": "1.0",
            "methods": ["POST"],
            "endpoint": "/api/student/exam/submit"
        }
        self.wfile.write(json.dumps(info).encode('utf-8'))
