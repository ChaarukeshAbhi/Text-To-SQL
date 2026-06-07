import re
import sqlparse
from sqlparse.sql import Statement
from sqlparse.tokens import Keyword, DDL, DML

# Keywords that cause data loss or structural changes
DESTRUCTIVE_KEYWORDS = [
    "DROP",
    "DELETE",
    "TRUNCATE",
    "ALTER",
    "DROP DATABASE",
    "DROP TABLE",
    "DELETE FROM",
]

# Patterns that look like SQL injection in the generated output
OUTPUT_INJECTION_PATTERNS = [
    r"union\s+select",
    r";\s*(drop|delete|truncate)",
    r"xp_cmdshell",
    r"exec(\s|\()+",
    r"into\s+outfile",
    r"load_file\s*\(",
    r"sleep\s*\(\s*\d+\s*\)",
    r"benchmark\s*\(",
    r"1\s*=\s*1",
    r"or\s+1\s*=\s*1",
]


def extract_sql_keywords(sql: str) -> list:
    """Parse the SQL and extract all keyword tokens."""
    parsed = sqlparse.parse(sql)
    found_keywords = []
    for statement in parsed:
        for token in statement.flatten():
            if token.ttype in (Keyword, DDL, DML):
                found_keywords.append(token.value.upper())
    return found_keywords


def check_response_security(sql: str) -> dict:
    """
    Layer 2: Checks the generated SQL for destructive or injected content.
    Returns a dict with:
      - 'safe': bool — whether to show the query at all
      - 'warnings': list — bold warnings to display to user
      - 'blocked': bool — whether the query is fully blocked
    """
    sql_upper = sql.upper().strip()
    warnings = []
    blocked = False

    # Check for SQL injection patterns in output
    for pattern in OUTPUT_INJECTION_PATTERNS:
        if re.search(pattern, sql.lower()):
            return {
                "safe": False,
                "warnings": [],
                "blocked": True,
                "reason": "I cannot provide this query as it contains patterns associated with SQL injection.",
            }

    # Use sqlparse to detect destructive keywords
    found_keywords = extract_sql_keywords(sql)

    for keyword in DESTRUCTIVE_KEYWORDS:
        # Check both via sqlparse and direct string match for reliability
        if keyword in found_keywords or keyword in sql_upper:
            warnings.append(
                f"⚠️ WARNING: This query contains **{keyword}** — "
                f"which can cause permanent data loss or structural changes to your database. "
                f"**ALL RESPONSES ARE NOT ALWAYS CORRECT. Review carefully before executing.**"
            )

    if warnings:
        return {
            "safe": True,
            "warnings": warnings,
            "blocked": False,
            "reason": "Query contains destructive keywords. User has been warned.",
        }

    return {
        "safe": True,
        "warnings": [],
        "blocked": False,
        "reason": "Response passed all security checks.",
    }