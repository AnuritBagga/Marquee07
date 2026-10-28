from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests - return API info"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        info = {
            "api": "Exam Submission API",
            "status": "online",
            "version": "1.0",
            "methods": ["POST"],
            "message": "Use POST to submit exam data"
        }
        self.wfile.write(json.dumps(info).encode('utf-8'))
    
    def do_POST(self):
        """Handle exam submission"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                raise ValueError("No data received")
                
            post_data = self.rfile.read(content_length)
            submission = json.loads(post_data.decode('utf-8'))
            
            print(f"✅ Received submission for exam: {submission.get('examId')}")
            print(f"Student: {submission.get('studentName')}")
            
            # Get submission data
            exam_id = submission.get('examId', 'unknown')
            student_name = submission.get('studentName', 'Unknown')
            student_email = submission.get('studentEmail', 'unknown@example.com')
            answers = submission.get('answers', {})
            time_taken = submission.get('timeTaken', 0)
            violations = submission.get('violations', [])
            
            # Calculate score
            # For demo: count answered questions
            # In production: check against correct answers
            total_questions = len(answers)
            
            # Simple scoring for demo
            # In production, you would fetch correct answers from database
            score = total_questions
            percentage = (score / total_questions * 100) if total_questions > 0 else 0
            
            # Create result
            result = {
                "success": True,
                "message": "Exam submitted successfully",
                "submissionId": f"sub_{exam_id}_{int(time_taken)}",
                "result": {
                    "examId": exam_id,
                    "studentName": student_name,
                    "studentEmail": student_email,
                    "score": score,
                    "totalQuestions": total_questions,
                    "percentage": round(percentage, 2),
                    "passed": percentage >= 60,
                    "timeTaken": time_taken,
                    "violations": len(violations),
                    "submittedAt": submission.get('submittedAt')
                }
            }
            
            print(f"✅ Submission processed - Score: {score}/{total_questions} ({percentage}%)")
            
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
            import traceback
            traceback.print_exc()
            self.send_error_response(500, str(e))
    
    def send_error_response(self, code, message):
        """Send error response"""
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_response = {
            "success": False,
            "error": message,
            "code": code
        }
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
