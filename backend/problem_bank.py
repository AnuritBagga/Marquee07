"""
Problem Bank for DSA and SQL Questions
Each problem includes test cases for validation
"""

DSA_PROBLEMS = [
    {
        "title": "Two Sum",
        "difficulty": "Easy",
        "description": """Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9, so we return [0, 1]

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]""",
        "testCases": [
            {"input": "nums = [2,7,11,15], target = 9", "expected": "[0,1]"},
            {"input": "nums = [3,2,4], target = 6", "expected": "[1,2]"},
            {"input": "nums = [3,3], target = 6", "expected": "[0,1]"},
            {"input": "nums = [1,5,3,7,9], target = 10", "expected": "[1,3] or [2,4]"}
        ]
    },
    {
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "description": """Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
Input: s = "()"
Output: true

**Example 2:**
Input: s = "()[]{}"
Output: true

**Example 3:**
Input: s = "(]"
Output: false""",
        "testCases": [
            {"input": 's = "()"', "expected": "true"},
            {"input": 's = "()[]{}"', "expected": "true"},
            {"input": 's = "(]"', "expected": "false"},
            {"input": 's = "([)]"', "expected": "false"}
        ]
    },
    {
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "description": """Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example 1:**
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

**Example 2:**
Input: head = [1,2]
Output: [2,1]

**Example 3:**
Input: head = []
Output: []

**Note:** You may implement the ListNode class if your language requires it.""",
        "testCases": [
            {"input": "head = [1,2,3,4,5]", "expected": "[5,4,3,2,1]"},
            {"input": "head = [1,2]", "expected": "[2,1]"},
            {"input": "head = []", "expected": "[]"},
            {"input": "head = [1]", "expected": "[1]"}
        ]
    },
    {
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "description": """Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

**Example 1:**
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

**Example 2:**
Input: nums = [1]
Output: 1

**Example 3:**
Input: nums = [5,4,-1,7,8]
Output: 23""",
        "testCases": [
            {"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "expected": "6"},
            {"input": "nums = [1]", "expected": "1"},
            {"input": "nums = [5,4,-1,7,8]", "expected": "23"},
            {"input": "nums = [-1]", "expected": "-1"}
        ]
    },
    {
        "title": "Merge Two Sorted Lists",
        "difficulty": "Easy",
        "description": """You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Example 1:**
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

**Example 2:**
Input: list1 = [], list2 = []
Output: []

**Example 3:**
Input: list1 = [], list2 = [0]
Output: [0]""",
        "testCases": [
            {"input": "list1 = [1,2,4], list2 = [1,3,4]", "expected": "[1,1,2,3,4,4]"},
            {"input": "list1 = [], list2 = []", "expected": "[]"},
            {"input": "list1 = [], list2 = [0]", "expected": "[0]"},
            {"input": "list1 = [2,3,4], list2 = [1,5]", "expected": "[1,2,3,4,5]"}
        ]
    },
    {
        "title": "Binary Search",
        "difficulty": "Easy",
        "description": """Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

**Example 1:**
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4

**Example 2:**
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1""",
        "testCases": [
            {"input": "nums = [-1,0,3,5,9,12], target = 9", "expected": "4"},
            {"input": "nums = [-1,0,3,5,9,12], target = 2", "expected": "-1"},
            {"input": "nums = [5], target = 5", "expected": "0"},
            {"input": "nums = [1,2,3,4,5], target = 1", "expected": "0"}
        ]
    },
    {
        "title": "Climbing Stairs",
        "difficulty": "Easy",
        "description": """You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example 1:**
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps

**Example 2:**
Input: n = 3
Output: 3
Explanation: Three ways: 1. 1+1+1, 2. 1+2, 3. 2+1""",
        "testCases": [
            {"input": "n = 2", "expected": "2"},
            {"input": "n = 3", "expected": "3"},
            {"input": "n = 4", "expected": "5"},
            {"input": "n = 5", "expected": "8"}
        ]
    },
    {
        "title": "First Unique Character",
        "difficulty": "Easy",
        "description": """Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return -1.

**Example 1:**
Input: s = "leetcode"
Output: 0

**Example 2:**
Input: s = "loveleetcode"
Output: 2

**Example 3:**
Input: s = "aabb"
Output: -1""",
        "testCases": [
            {"input": 's = "leetcode"', "expected": "0"},
            {"input": 's = "loveleetcode"', "expected": "2"},
            {"input": 's = "aabb"', "expected": "-1"},
            {"input": 's = "z"', "expected": "0"}
        ]
    }
]

SQL_PROBLEMS = [
    {
        "title": "Find Second Highest Salary",
        "difficulty": "Medium",
        "description": """Write a SQL query to find the second highest salary from the Employee table.

**Table: Employee**
```
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

**Expected Output:**
```
+---------------------+
| SecondHighestSalary |
+---------------------+
| 200                 |
+---------------------+
```

If there is no second highest salary, return null.""",
        "testCases": [
            {"input": "Employee table with salaries [100, 200, 300]", "expected": "200"},
            {"input": "Employee table with salaries [100]", "expected": "null"},
            {"input": "Employee table with salaries [100, 100, 200]", "expected": "100"},
            {"input": "Employee table with salaries [200, 200, 200]", "expected": "null"}
        ]
    },
    {
        "title": "Employees Earning More Than Managers",
        "difficulty": "Easy",
        "description": """Write a SQL query to find employees who earn more than their managers.

**Table: Employee**
```
+----+-------+--------+-----------+
| Id | Name  | Salary | ManagerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+
```

**Expected Output:**
```
+----------+
| Employee |
+----------+
| Joe      |
+----------+
```""",
        "testCases": [
            {"input": "Joe earns 70000, manager Sam earns 60000", "expected": "Joe"},
            {"input": "All employees earn less than managers", "expected": "Empty result"},
            {"input": "Employee has no manager", "expected": "Not included"},
            {"input": "Manager field is NULL", "expected": "Not included"}
        ]
    },
    {
        "title": "Duplicate Emails",
        "difficulty": "Easy",
        "description": """Write a SQL query to find all duplicate emails in a table named Person.

**Table: Person**
```
+----+---------+
| Id | Email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+
```

**Expected Output:**
```
+---------+
| Email   |
+---------+
| a@b.com |
+---------+
```""",
        "testCases": [
            {"input": "Emails: [a@b.com, c@d.com, a@b.com]", "expected": "a@b.com"},
            {"input": "Emails: [a@b.com, b@c.com, c@d.com]", "expected": "Empty result"},
            {"input": "Emails: [x@y.com, x@y.com, x@y.com]", "expected": "x@y.com"},
            {"input": "Emails: [a@b.com, a@b.com, c@d.com, c@d.com]", "expected": "a@b.com, c@d.com"}
        ]
    },
    {
        "title": "Department Top Three Salaries",
        "difficulty": "Hard",
        "description": """Write a SQL query to find employees who are in the top 3 unique salaries in each department.

**Table: Employee**
```
+----+-------+--------+--------------+
| Id | Name  | Salary | DepartmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 85000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
| 5  | Janet | 69000  | 1            |
| 6  | Randy | 85000  | 1            |
+----+-------+--------+--------------+
```

Return the employees ranked in top 3 for each department.""",
        "testCases": [
            {"input": "Department 1: salaries [85000, 90000, 69000, 85000]", "expected": "All 4 employees (top 3 unique salaries)"},
            {"input": "Department 2: salaries [80000, 60000]", "expected": "Both employees"},
            {"input": "Department with < 3 employees", "expected": "All employees in that department"},
            {"input": "Department with ties in 3rd position", "expected": "Include all tied employees"}
        ]
    },
    {
        "title": "Nth Highest Salary",
        "difficulty": "Medium",
        "description": """Write a SQL query to get the nth highest salary from the Employee table.

**Table: Employee**
```
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

For example, given the above Employee table, the nth highest salary where n = 2 is 200.
If there is no nth highest salary, return null.""",
        "testCases": [
            {"input": "n = 2, salaries [100, 200, 300]", "expected": "200"},
            {"input": "n = 1, salaries [100, 200, 300]", "expected": "300"},
            {"input": "n = 4, salaries [100, 200, 300]", "expected": "null"},
            {"input": "n = 2, salaries [200, 200, 100]", "expected": "100"}
        ]
    },
    {
        "title": "Consecutive Numbers",
        "difficulty": "Medium",
        "description": """Write a SQL query to find all numbers that appear at least three times consecutively.

**Table: Logs**
```
+----+-----+
| Id | Num |
+----+-----+
| 1  | 1   |
| 2  | 1   |
| 3  | 1   |
| 4  | 2   |
| 5  | 1   |
| 6  | 2   |
| 7  | 2   |
+----+-----+
```

**Expected Output:**
```
+-----------------+
| ConsecutiveNums |
+-----------------+
| 1               |
+-----------------+
```""",
        "testCases": [
            {"input": "Numbers: [1,1,1,2,1,2,2]", "expected": "1"},
            {"input": "Numbers: [1,2,3,4,5]", "expected": "Empty result"},
            {"input": "Numbers: [5,5,5,5]", "expected": "5"},
            {"input": "Numbers: [1,1,2,2,2,3]", "expected": "2"}
        ]
    }
]


def get_random_dsa_problem(exclude_titles=None):
    """Get a random DSA problem, optionally excluding certain titles"""
    import random
    
    if exclude_titles is None:
        exclude_titles = []
    
    available = [p for p in DSA_PROBLEMS if p["title"] not in exclude_titles]
    
    if not available:
        # If all problems used, start over
        available = DSA_PROBLEMS
    
    return random.choice(available)


def get_random_sql_problem():
    """Get a random SQL problem"""
    import random
    return random.choice(SQL_PROBLEMS)
