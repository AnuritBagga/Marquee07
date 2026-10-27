"""
AI Chatbot for Exam Creation using Groq + LangChain
Helps organizations create exams through natural conversation
"""

import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from pydantic import BaseModel, Field

# ============================================
# Pydantic Models for Structured Output
# ============================================

class QuestionOption(BaseModel):
    id: str = Field(description="Option ID (A, B, C, D)")
    text: str = Field(description="Option text")

class Question(BaseModel):
    question_type: str = Field(description="Type: mcq, multiple_select, coding, descriptive, true_false")
    question_text: str = Field(description="The actual question")
    difficulty: str = Field(description="easy, medium, or hard")
    marks: float = Field(description="Marks for this question")
    negative_marks: float = Field(default=0, description="Negative marks for wrong answer")
    
    # For MCQ
    options: Optional[List[QuestionOption]] = None
    correct_answers: Optional[List[str]] = None
    
    # For Coding
    coding_language: Optional[List[str]] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    starter_code: Optional[Dict[str, str]] = None
    constraints: Optional[str] = None
    
    explanation: str = Field(description="Detailed explanation of the answer")
    topic_tags: List[str] = Field(description="Topics covered by this question")

class ExamConfiguration(BaseModel):
    title: str
    description: str
    exam_type: str = "placement"  # placement, practice, mock, contest
    duration_minutes: int
    total_marks: float
    passing_marks: float
    negative_marking_enabled: bool = False
    shuffle_questions: bool = True
    shuffle_options: bool = True
    proctoring_enabled: bool = True

class QuestionBank(BaseModel):
    name: str
    description: str
    subject: str
    difficulty: str
    questions: List[Question]

# ============================================
# AI Chatbot Class
# ============================================

class ExamCreatorChatbot:
    def __init__(self, groq_api_key: str):
        """Initialize the chatbot with Groq API"""
        
        # Initialize Groq LLM
        self.llm = ChatGroq(
            api_key=groq_api_key,
            model_name="mixtral-8x7b-32768",  # Fast and powerful
            temperature=0.7,
            max_tokens=4096
        )
        
        # System prompt for exam creation
        self.system_prompt = """You are an expert AI assistant specializing in creating educational assessments and exams. Your role is to help organizations (companies and colleges) create comprehensive, fair, and well-structured exams.

Your capabilities:
1. Create question banks from scratch based on topics/syllabus
2. Generate questions in multiple formats: MCQ, Multiple Select, Coding, Descriptive, True/False
3. Design complete exams with proper difficulty distribution
4. Configure marking schemes including negative marking
5. Ensure questions are clear, unambiguous, and test real knowledge
6. Create coding questions with test cases
7. Suggest exam structures based on organization needs

Guidelines:
- Always ask clarifying questions before generating content
- Ensure diversity in question difficulty
- Create realistic, practical questions
- For coding questions, provide clear problem statements and test cases
- Suggest best practices for exam configuration
- Be conversational and helpful

Current conversation context will guide your responses. Extract and structure information methodically."""

        # Conversation memory
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Conversation chain
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            verbose=True
        )
        
    def chat(self, user_message: str, conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Main chat method - handles user input and returns AI response
        """
        try:
            # Add system context for structured output
            full_prompt = f"""{self.system_prompt}

User: {user_message}

Please respond naturally and helpfully. If the user is ready to generate questions or create an exam, structure your response clearly."""

            # Get AI response
            response = self.llm.invoke([
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=user_message)
            ])
            
            return {
                "success": True,
                "message": response.content,
                "conversation_id": conversation_id,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "I encountered an error. Please try again."
            }
    
    async def generate_questions(
        self, 
        subject: str,
        topic: str,
        num_questions: int,
        difficulty: str,
        question_type: str,
        syllabus: Optional[str] = None,
        additional_context: Optional[str] = None
    ) -> List[Question]:
        """
        Generate questions based on parameters
        """
        
        prompt = f"""Generate {num_questions} {difficulty} level {question_type} questions on the topic: {topic} (Subject: {subject}).

{"Based on this syllabus/context: " + syllabus if syllabus else ""}
{"Additional instructions: " + additional_context if additional_context else ""}

Requirements:
1. Each question should test core understanding
2. For MCQs, provide 4 options with clear correct answer
3. For coding questions, include test cases and constraints
4. Add detailed explanations
5. Tag questions with relevant topics

Return the questions in this exact JSON format:
{{
    "questions": [
        {{
            "question_type": "{question_type}",
            "question_text": "Your question here",
            "difficulty": "{difficulty}",
            "marks": 1,
            "negative_marks": 0.25,
            "options": [{{"id": "A", "text": "Option A"}}, {{"id": "B", "text": "Option B"}}, {{"id": "C", "text": "Option C"}}, {{"id": "D", "text": "Option D"}}],
            "correct_answers": ["A"],
            "explanation": "Detailed explanation",
            "topic_tags": ["topic1", "topic2"]
        }}
    ]
}}

IMPORTANT: Return ONLY the JSON object, no additional text."""

        try:
            response = self.llm.invoke([
                SystemMessage(content="You are a JSON-generating AI. Return only valid JSON, no markdown or extra text."),
                HumanMessage(content=prompt)
            ])
            
            # Parse JSON response
            json_str = response.content.strip()
            
            # Remove markdown code blocks if present
            if json_str.startswith("```json"):
                json_str = json_str.replace("```json", "").replace("```", "").strip()
            elif json_str.startswith("```"):
                json_str = json_str.replace("```", "").strip()
            
            result = json.loads(json_str)
            
            # Validate and convert to Pydantic models
            questions = [Question(**q) for q in result.get("questions", [])]
            
            return questions
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Response was: {response.content[:500]}")
            return []
        except Exception as e:
            print(f"Error generating questions: {e}")
            return []
    
    async def generate_coding_question(
        self,
        topic: str,
        difficulty: str,
        language: List[str] = ["python", "java", "cpp"]
    ) -> Optional[Question]:
        """
        Generate a single coding question with test cases
        """
        
        prompt = f"""Create a {difficulty} level coding problem on the topic: {topic}.

The question should:
1. Have a clear problem statement
2. Include input/output format
3. Provide 3-4 test cases (including edge cases)
4. Include constraints
5. Provide starter code for {', '.join(language)}
6. Have a detailed solution explanation

Return in this JSON format:
{{
    "question_type": "coding",
    "question_text": "Problem statement with input/output format",
    "difficulty": "{difficulty}",
    "marks": 10,
    "coding_language": {json.dumps(language)},
    "test_cases": [
        {{"input": "5\\n1 2 3 4 5", "output": "15", "hidden": false, "explanation": "Sum of 1+2+3+4+5"}},
        {{"input": "3\\n10 20 30", "output": "60", "hidden": false}}
    ],
    "starter_code": {{
        "python": "def solve(arr):\\n    # Your code here\\n    pass",
        "java": "public static int solve(int[] arr) {{\\n    // Your code here\\n}}",
        "cpp": "int solve(vector<int>& arr) {{\\n    // Your code here\\n}}"
    }},
    "constraints": "1 <= n <= 10^5\\n1 <= arr[i] <= 10^9",
    "explanation": "Detailed solution approach",
    "topic_tags": ["{topic}", "arrays"]
}}

Return ONLY the JSON object."""

        try:
            response = self.llm.invoke([
                SystemMessage(content="You are a JSON-generating AI for coding questions. Return only valid JSON."),
                HumanMessage(content=prompt)
            ])
            
            # Parse and validate
            json_str = response.content.strip()
            if "```" in json_str:
                json_str = json_str.split("```")[1].replace("json", "").strip()
            
            question_data = json.loads(json_str)
            question = Question(**question_data)
            
            return question
            
        except Exception as e:
            print(f"Error generating coding question: {e}")
            return None
    
    async def analyze_syllabus_and_suggest(self, syllabus_text: str) -> Dict[str, Any]:
        """
        Analyze syllabus and suggest exam structure
        """
        
        prompt = f"""Analyze this syllabus and suggest an optimal exam structure:

{syllabus_text}

Provide:
1. Key topics that should be covered
2. Suggested number of questions per topic
3. Difficulty distribution (easy/medium/hard %)
4. Question type distribution (MCQ, Coding, Descriptive)
5. Recommended exam duration
6. Total marks and passing criteria

Return as JSON:
{{
    "topics": ["topic1", "topic2"],
    "question_distribution": {{
        "topic1": {{"easy": 2, "medium": 3, "hard": 1}},
        "topic2": {{"easy": 3, "medium": 2, "hard": 1}}
    }},
    "question_types": {{"mcq": 20, "coding": 5, "descriptive": 2}},
    "suggested_duration_minutes": 120,
    "total_marks": 100,
    "passing_marks": 40
}}"""

        try:
            response = self.llm.invoke([
                SystemMessage(content="You are an exam design expert. Return only valid JSON."),
                HumanMessage(content=prompt)
            ])
            
            json_str = response.content.strip()
            if "```" in json_str:
                json_str = json_str.split("```")[1].replace("json", "").strip()
            
            suggestion = json.loads(json_str)
            return suggestion
            
        except Exception as e:
            print(f"Error analyzing syllabus: {e}")
            return {}
    
    def extract_exam_intent(self, conversation_history: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
        """
        Extract exam creation intent from conversation
        """
        
        # Combine conversation
        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in conversation_history
        ])
        
        prompt = f"""Analyze this conversation and extract exam creation parameters:

{conversation_text}

Extract and structure:
- Exam title
- Subject/topic
- Number of questions
- Question types
- Difficulty level
- Duration
- Marking scheme
- Any special requirements

Return as JSON or null if not enough information:
{{
    "ready_to_create": true/false,
    "exam_title": "...",
    "subject": "...",
    "num_questions": 30,
    "question_types": ["mcq", "coding"],
    "difficulty": "medium",
    "duration_minutes": 120,
    "negative_marking": true,
    "missing_info": ["what info is still needed"]
}}"""

        try:
            response = self.llm.invoke([
                SystemMessage(content="You are a conversation analyzer. Return only JSON."),
                HumanMessage(content=prompt)
            ])
            
            json_str = response.content.strip()
            if "```" in json_str:
                json_str = json_str.split("```")[1].replace("json", "").strip()
            
            intent = json.loads(json_str)
            return intent
            
        except:
            return None

# ============================================
# Convenience Functions
# ============================================

def create_chatbot(groq_api_key: str) -> ExamCreatorChatbot:
    """Factory function to create chatbot instance"""
    return ExamCreatorChatbot(groq_api_key)

async def quick_generate_questions(
    groq_api_key: str,
    subject: str,
    topic: str,
    num_questions: int = 10,
    difficulty: str = "medium",
    question_type: str = "mcq"
) -> List[Question]:
    """Quick function to generate questions without chat context"""
    
    chatbot = create_chatbot(groq_api_key)
    questions = await chatbot.generate_questions(
        subject=subject,
        topic=topic,
        num_questions=num_questions,
        difficulty=difficulty,
        question_type=question_type
    )
    return questions

# ============================================
# Example Usage
# ============================================

if __name__ == "__main__":
    import asyncio
    
    # Test the chatbot
    async def test():
        # Initialize
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("Please set GROQ_API_KEY environment variable")
            return
        
        chatbot = create_chatbot(api_key)
        
        # Test conversation
        print("=== Testing Chat ===")
        response = chatbot.chat("Hi! I want to create a placement drive exam for software engineers.")
        print(f"AI: {response['message']}\n")
        
        # Test question generation
        print("=== Testing Question Generation ===")
        questions = await chatbot.generate_questions(
            subject="Data Structures",
            topic="Arrays",
            num_questions=3,
            difficulty="medium",
            question_type="mcq"
        )
        
        for i, q in enumerate(questions, 1):
            print(f"\nQuestion {i}:")
            print(f"Type: {q.question_type}")
            print(f"Text: {q.question_text}")
            print(f"Difficulty: {q.difficulty}")
            if q.options:
                print("Options:")
                for opt in q.options:
                    print(f"  {opt.id}. {opt.text}")
            print(f"Correct: {q.correct_answers}")
        
        # Test coding question
        print("\n=== Testing Coding Question ===")
        coding_q = await chatbot.generate_coding_question(
            topic="Dynamic Programming",
            difficulty="hard"
        )
        
        if coding_q:
            print(f"Problem: {coding_q.question_text[:200]}...")
            print(f"Languages: {coding_q.coding_language}")
            print(f"Test Cases: {len(coding_q.test_cases)}")
    
    asyncio.run(test())
