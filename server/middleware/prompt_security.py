import re

PROMPT_INJECTION_PATTERNS = [
    r"ignore (all |previous |above |prior )?instructions",
    r"disregard (all |previous |above |prior )?instructions",
    r"forget (all |previous |above |prior )?instructions",
    r"you are now",
    r"act as (a |an )?(?!sql|database|db)",
    r"pretend (you are|to be)",
    r"override (your |all )?instructions",
    r"system prompt",
    r"jailbreak",
    r"do anything now",
    r"dan mode",
]

SQL_INJECTION_PATTERNS = [
    r";\s*(drop|delete|truncate|alter|update|insert)\s",
    r"'\s*(or|and)\s*'?\d+'?\s*=\s*'?\d+",
    r"union\s+select",
    r"1\s*=\s*1",
    r"--\s*$",
    r"/\*.*\*/",
    r"xp_cmdshell",
    r"exec(\s|\()+",
    r"information_schema",
    r"sleep\s*\(\s*\d+\s*\)",
    r"benchmark\s*\(",
    r"load_file\s*\(",
    r"into\s+outfile",
]

# Extra patterns specific to schema input abuse
SCHEMA_INJECTION_PATTERNS = [
    r"ignore (all |previous |above |prior )?instructions",
    r"disregard.*instructions",
    r"you are now",
    r"system prompt",
    r"reveal.*password",
    r"show.*credentials",
    r"print.*secret",
    r"expose.*config",
    r"--.*drop",
    r";\s*(drop|delete|truncate)\s",
    r"xp_cmdshell",
    r"exec(\s|\()+",
    r"load_file\s*\(",
    r"into\s+outfile",
]


def check_prompt_security(prompt: str) -> dict:
    prompt_lower = prompt.lower().strip()

    if not prompt_lower:
        return {"safe": False, "reason": "Empty prompt received."}

    if len(prompt) > 2000:
        return {"safe": False, "reason": "Prompt exceeds maximum allowed length of 2000 characters."}

    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, prompt_lower):
            return {"safe": False, "reason": "Prompt injection attempt detected. Please rephrase your query."}

    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, prompt_lower):
            return {"safe": False, "reason": "SQL injection pattern detected in your prompt. Please ask a legitimate data question."}

    return {"safe": True, "reason": "Prompt passed security checks."}


def check_schema_security(schema: str) -> dict:
    """
    Dedicated security check for user-submitted schema.
    Checks for prompt injection hidden inside schema definitions.
    """
    if not schema or not schema.strip():
        return {"safe": False, "reason": "Schema is empty."}

    if len(schema) > 10000:
        return {"safe": False, "reason": "Schema exceeds maximum allowed length of 10000 characters."}

    schema_lower = schema.lower().strip()

    for pattern in SCHEMA_INJECTION_PATTERNS:
        if re.search(pattern, schema_lower):
            return {
                "safe": False,
                "reason": "Security threat detected in schema input. Schema contains suspicious patterns and has been rejected."
            }

    return {"safe": True, "reason": "Schema passed security checks."}