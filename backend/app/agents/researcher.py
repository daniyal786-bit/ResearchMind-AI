from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.config import GROQ_API_KEY, GROQ_MODEL
from app.tools.web_search import search_web


llm = ChatGroq(
    model=GROQ_MODEL,
    api_key=GROQ_API_KEY,
    temperature=0.3
)


RESEARCHER_PROMPT = """
You are the Research Agent of ResearchMind AI.

You receive a research task and web search results.

Analyze the provided search results and produce useful research findings.

Rules:
1. Use the provided sources as evidence.
2. Do not invent facts.
3. Do not invent URLs.
4. Clearly explain important findings.
5. Mention the source URL for important claims.
6. Identify conflicting information when sources disagree.
7. Keep the response structured and concise.

Return:
- Key Findings
- Evidence
- Sources
"""


def research_task(task: str):

    search_results = search_web(task, max_results=2)

    formatted_results = ""

    for index, result in enumerate(search_results, start=1):

        formatted_results += f"""
SOURCE {index}

Title:
{result.get("title")}

URL:
{result.get("url")}

Content:
{result.get("content")}

-------------------------
"""

    messages = [
        SystemMessage(content=RESEARCHER_PROMPT),
        HumanMessage(
            content=f"""
Research Task:

{task}

Web Search Results:

{formatted_results}
"""
        )
    ]

    response = llm.invoke(messages)

    sources = []

    for result in search_results:

        sources.append({
            "title": result.get("title"),
            "url": result.get("url")
        })

    return {
        "findings": response.content,
        "sources": sources
    }