from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.config import GROQ_API_KEY, GROQ_MODEL


llm = ChatGroq(
    model=GROQ_MODEL,
    api_key=GROQ_API_KEY,
    temperature=0.2
)


PLANNER_PROMPT = """
You are the Planner Agent of ResearchMind AI.

Your job is to analyze the user's research question and create a
clear research plan.

Break the question into 3 to 5 specific research tasks.

Return ONLY a numbered list of research tasks.

Do not answer the research question.
Only create the research plan.
"""


def create_research_plan(question: str) -> str:

    messages = [
        SystemMessage(content=PLANNER_PROMPT),
        HumanMessage(content=question)
    ]

    response = llm.invoke(messages)

    return response.content