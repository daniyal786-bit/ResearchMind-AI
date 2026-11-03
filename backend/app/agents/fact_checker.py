from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.config import GROQ_API_KEY, GROQ_MODEL


llm = ChatGroq(
    model=GROQ_MODEL,
    api_key=GROQ_API_KEY,
    temperature=0.1
)


FACT_CHECKER_PROMPT = """
You are the Fact-Checking Agent of ResearchMind AI.

Your job is to examine research findings and evaluate the claims
using the evidence and sources provided.

For each important claim:

1. Identify the claim.
2. Examine the supporting evidence.
3. Determine whether the evidence supports the claim.
4. Identify conflicting information.
5. Never invent evidence.
6. Never invent sources.
7. If the evidence is insufficient, clearly say so.

Classify claims as:

- SUPPORTED
- PARTIALLY SUPPORTED
- CONFLICTING
- INSUFFICIENT EVIDENCE

Return a concise structured fact-checking report.
"""


def fact_check(findings: str) -> str:

    # Limit the research text sent to Groq
    # Keep the Fact Checker input small
    findings = findings[:5000]

    messages = [
        SystemMessage(content=FACT_CHECKER_PROMPT),
        HumanMessage(
            content=f"""
Research Findings:

{findings}

Perform concise fact-checking .
Focus only on the most important claims.
"""
        )
    ]

    response = llm.invoke(messages)

    return response.content