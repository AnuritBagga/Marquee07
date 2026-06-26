# New version of practice_question endpoint with DSA/SQL support

@api_router.post("/practice/question", response_model=PracticeQuestionResponse)
async def practice_question(payload: PracticeQuestionRequest):
    if not groq_client and not OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="No AI API keys configured")

    # ── HANDLE DSA QUESTIONS ────────────────────────────────────────────────
    if payload.questionType == "dsa":
        problem = get_random_dsa_problem(exclude_titles=payload.usedDsaTitles or [])
        return PracticeQuestionResponse(
            question=f"Great! Now let's move to a coding problem. I'll give you a {problem['difficulty']} difficulty problem. Take your time to think through it and write your solution in the code editor.",
            type="dsa",
            dsaProblem=problem,
            sqlProblem=None,
            ended=False,
            closing=None
        )
    
    # ── HANDLE SQL QUESTIONS ────────────────────────────────────────────────
    if payload.questionType == "sql":
        problem = get_random_sql_problem()
        return PracticeQuestionResponse(
            question=f"Excellent! For the final question, let's test your SQL skills. Here's a {problem['difficulty']} difficulty database problem. Write your SQL query in the editor.",
            type="sql",
            sqlProblem=problem,
            dsaProblem=None,
            ended=False,
            closing=None
        )

    # ── HANDLE VERBAL QUESTIONS (rest of the original code)─────────────────
    system = build_practice_system(
        payload.interviewType,
        payload.resumeText or "",
        payload.skills or [],
    )

    messages = [{"role": "system", "content": system}]
    for t in payload.history[-14:]:
        role = "assistant" if t.role == "assistant" else "user"
        messages.append({"role": role, "content": t.content})

    if not payload.history:
        messages.append({
            "role": "user",
            "content": (
                f"Begin the interview now. This is Question 1. "
                f"Greet {payload.candidateName or 'the candidate'} warmly in one brief sentence, "
                f"then ask them to introduce themselves. "
                f"Your first question MUST be 'Tell me about yourself' or similar. "
                f"Return valid JSON per the schema."
            ),
        })
    else:
        q_num = len([m for m in messages if m.get('role') == 'assistant']) + 1
        messages.append({
            "role": "user",
            "content": (
                f"Continue the interview. This is Question {q_num}. "
                "Follow the interview flow strictly. Cross-question my last answer or ask the next "
                "relevant question based on the flow. Use natural acknowledgments when appropriate. "
                "Return valid JSON per the schema."
            ),
        })

    raw = None

    # Try Groq first, then OpenRouter fallback
    if groq_client:
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.72,
                max_tokens=800,
            )
            raw = (completion.choices[0].message.content or "").strip()
            logger.info(f"Groq practice raw: {raw[:300]}")
        except Exception as e:
            logger.warning(f"Groq failed, trying OpenRouter fallback: {e}")
            if OPENROUTER_API_KEY:
                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        response = await client.post(
                            OPENROUTER_API_URL,
                            headers={
                                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                                "Content-Type": "application/json",
                            },
                            json={
                                "model": "meta-llama/llama-3.3-70b-instruct",
                                "messages": messages,
                                "temperature": 0.72,
                                "max_tokens": 800,
                            }
                        )
                        if response.status_code == 200:
                            raw = response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                            logger.info(f"OpenRouter fallback success: {raw[:300]}")
                        else:
                            raise HTTPException(status_code=502, detail=f"OpenRouter failed: {response.status_code}")
                except Exception as or_error:
                    logger.exception("OpenRouter fallback failed")
                    raise HTTPException(status_code=502, detail=f"Both APIs failed. Groq: {e}, OR: {or_error}")
            else:
                raise HTTPException(status_code=502, detail=f"Groq failed and no OpenRouter key: {e}")
    elif OPENROUTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    OPENROUTER_API_URL,
                    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
                    json={
                        "model": "meta-llama/llama-3.3-70b-instruct",
                        "messages": messages,
                        "temperature": 0.72,
                        "max_tokens": 800,
                    },
                )
                if response.status_code == 200:
                    raw = response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                else:
                    raise HTTPException(status_code=502, detail=f"OpenRouter failed: {response.text[:200]}")
        except Exception as e:
            logger.exception("OpenRouter request failed")
            raise HTTPException(status_code=502, detail=f"OpenRouter failed: {e}")

    if not raw:
        raise HTTPException(status_code=502, detail="Failed to get response from any API")

    try:
        data = extract_json(raw)
    except Exception as e:
        logger.warning(f"JSON parse failed, using raw text. Error: {e}")
        data = {
            "question": raw.strip().strip('"'),
            "type": "verbal",
            "dsaProblem": None,
            "sqlProblem": None,
            "ended": False,
            "closing": None,
        }

    return PracticeQuestionResponse(
        question=data.get("question", ""),
        type=data.get("type", "verbal"),
        dsaProblem=data.get("dsaProblem"),
        sqlProblem=data.get("sqlProblem"),
        ended=data.get("ended", False),
        closing=data.get("closing"),
    )
