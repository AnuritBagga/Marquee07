# DSA & SQL Questions Implementation Summary

## ✅ What I've Done

### 1. Created Problem Bank (`backend/problem_bank.py`)
- **8 DSA Problems** with test cases:
  - Two Sum (Easy)
  - Valid Parentheses (Easy)
  - Reverse Linked List (Easy)
  - Maximum Subarray (Medium)
  - Merge Two Sorted Lists (Easy)
  - Binary Search (Easy)
  - Climbing Stairs (Easy)
  - First Unique Character (Easy)

- **6 SQL Problems** with test cases:
  - Find Second Highest Salary (Medium)
  - Employees Earning More Than Managers (Easy)
  - Duplicate Emails (Easy)
  - Department Top Three Salaries (Hard)
  - Nth Highest Salary (Medium)
  - Consecutive Numbers (Medium)

- Each problem has 4 test cases for validation
- Random selection ensures no duplicate DSA questions

### 2. Updated Backend Models (`backend/server.py`)
- ✅ Added `questionType` field to `PracticeQuestionRequest`
- ✅ Added `usedDsaTitles` tracking to prevent duplicates
- ✅ Added `sqlProblem` field to `PracticeQuestionResponse`
- ✅ Imported problem bank functions

### 3. Created New Endpoint Logic (`backend/practice_endpoint_new.py`)
- Detects when `questionType == "dsa"` → returns random DSA problem
- Detects when `questionType == "sql"` → returns random SQL problem
- Otherwise → continues with normal verbal AI questions

## ⚠️ What Still Needs To Be Done

### Backend:
The `practice_question` endpoint in `server.py` needs to be replaced with the new version that handles DSA/SQL. The new logic is in `practice_endpoint_new.py` but needs to be integrated into the main `server.py` file.

**Option A: Manual Integration**
Replace the `practice_question` function starting at line ~488 in `server.py` with the version from `practice_endpoint_new.py`.

**Option B: I can restart the backend once you confirm**
This will test if the problem bank loads correctly.

### Frontend (`frontend/src/hooks/usePracticeInterview.js`):
Need to update `fetchQuestion` to send:
```javascript
const fetchQuestion = useCallback(async (hist, nextIndex) => {
  setPhase("asking");
  const schedule = QUESTION_SCHEDULE[nextIndex] || { type: "cross_question", limitSeconds: 70 };
  
  const { data } = await axios.post(`${API}/practice/question`, {
    interviewType,
    history: hist,
    resumeText,
    skills,
    candidateName,
    questionType: schedule.type,  // ← ADD THIS: sends "dsa", "sql", or other
    questionIndex: nextIndex,      // ← ADD THIS
    usedDsaTitles: usedDsaTitlesRef.current || []  // ← ADD THIS (need to create this ref)
  });
  
  // Handle the response
  if (data.dsaProblem) {
    setDsaProblem(data.dsaProblem);
    // Track used DSA problem
    usedDsaTitlesRef.current = [...(usedDsaTitlesRef.current || []), data.dsaProblem.title];
  }
  if (data.sqlProblem) {
    setSqlProblem(data.sqlProblem);
  }
  
  return data;
}, [interviewType, resumeText, skills, candidateName]);
```

Also need to add:
```javascript
const usedDsaTitlesRef = useRef([]);  // Track which DSA problems were used
```

##  How It Will Work

1. **Q1-8:** Normal verbal questions via AI
2. **Q9:** Frontend sends `questionType: "dsa"` → Backend returns random DSA problem → Code editor appears
3. **Q10:** Frontend sends `questionType: "dsa"` with `usedDsaTitles: ["Two Sum"]` → Backend returns different DSA problem → Code editor appears
4. **Q11:** Frontend sends `questionType: "sql"` → Backend returns random SQL problem → SQL editor appears

## Test Cases Are Included

Each problem has 4 test cases that show:
- **Input:** What goes into the function/query
- **Expected:** What the output should be

Example:
```javascript
"testCases": [
  {"input": "nums = [2,7,11,15], target = 9", "expected": "[0,1]"},
  {"input": "nums = [3,2,4], target = 6", "expected": "[1,2]"},
  ...
]
```

## Next Steps

Would you like me to:
1. **Restart backend** to test if problem bank loads correctly?
2. **Update the frontend** to send questionType?
3. **Both** - complete the full integration?

Let me know and I'll proceed!
