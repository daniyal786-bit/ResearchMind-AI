from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agents.planner import create_research_plan
from app.agents.researcher import research_task

from app.services.research_workflow import run_research_workflow
from app.agents.fact_checker import fact_check

from app.agents.reviewer import review_report

app = FastAPI(
    title="ResearchMind AI",
    description="Multi-Agent Research and Intelligence System",
    version="1.0.0"
)

app = FastAPI(
    title="ResearchMind AI",
    description="Multi-Agent Research and Intelligence System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "message": "ResearchMind AI is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/plan")
def create_plan(request: ResearchRequest):

    plan = create_research_plan(request.question)

    return {
        "question": request.question,
        "research_plan": plan
    }

@app.post("/research")
def research(request: ResearchRequest):

    findings = research_task(request.question)

    return {
        "research_task": request.question,
        "findings": findings
    }

@app.post("/research/full")
def full_research(request: ResearchRequest):

    result = run_research_workflow(request.question)

    return result

@app.post("/fact-check")
def fact_check_endpoint(request: ResearchRequest):

    result = fact_check(request.question)

    return {
        "fact_check": result
    }

@app.post("/review")
def review(request: ResearchRequest):

    result = review_report(request.question)

    return {
        "review": result
    }

@app.post("/research/report")
def research_report(request: ResearchRequest):

    result = run_research_workflow(request.question)

    return {
        "question": result["question"],
        "report": result["final_report"],
        "sources": result["sources"],
        "review": result["review"]
    }