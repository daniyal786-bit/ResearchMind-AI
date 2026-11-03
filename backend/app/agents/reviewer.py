from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.config import GROQ_API_KEY, GROQ_MODEL


llm = ChatGroq(
    model=GROQ_MODEL,
    api_key=GROQ_API_KEY,
    temperature=0.1
)


REVIEWER_PROMPT = """
You are the Reviewer Agent of ResearchMind AI.

Your job is to review a final intelligence report before it is delivered
to the user.

Check the report for:

1. Unsupported or unclear claims
2. Missing or weak evidence
3. Contradictions
4. Incorrect or suspicious source references
5. Unclear explanations
6. Poor structure or readability

Rules:

- Do not invent facts.
- Do not invent sources or URLs.
- Only review the information provided.
- Keep the review concise.
- Identify important issues only.

Return:

- Review Status
- Issues Found
- Recommended Improvements
"""


def review_report(report: str) -> str:

    report = report[:7000]

    messages = [
        SystemMessage(content=REVIEWER_PROMPT),
        HumanMessage(
            content=f"""
Final Intelligence Report:

{report}

Review this report and identify any important issues.
"""
        )
    ]

    response = llm.invoke(messages)

    return response.content