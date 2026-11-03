from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.config import GROQ_API_KEY, GROQ_MODEL


llm = ChatGroq(
    model=GROQ_MODEL,
    api_key=GROQ_API_KEY,
    temperature=0.2
)


WRITER_PROMPT = """
You are the Writer Agent of ResearchMind AI.

Your job is to transform research findings and fact-checking results
into a professional intelligence report.

The report must contain:

1. Executive Summary
2. Key Findings
3. Detailed Analysis
4. Evidence and Sources
5. Conflicting Information
6. Conclusion

Rules:

- Use only the information provided.
- Do not invent facts.
- Do not invent sources or URLs.
- Clearly distinguish verified information from uncertain information.
- Keep the report professional and concise.
- Preserve important source URLs.
"""


def write_report(findings: str, fact_check_result: str) -> str:

    # Limit the amount of research and fact-checking text
    findings = findings[:7000]
    fact_check_result = fact_check_result[:5000]

    messages = [
        SystemMessage(content=WRITER_PROMPT),
        HumanMessage(
            content=f"""
Research Findings:

{findings}

-------------------------

Fact-Checking Results:

{fact_check_result}

-------------------------

Write a concise final intelligence report.
"""
        )
    ]

    response = llm.invoke(messages)

    return response.content