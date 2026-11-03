from app.agents.planner import create_research_plan
from app.agents.researcher import research_task
from app.agents.fact_checker import fact_check
from app.agents.writer import write_report
from app.agents.reviewer import review_report


def run_research_workflow(question: str):

    # Step 1: Create research plan
    plan = create_research_plan(question)

    # Step 2: Convert numbered plan into individual tasks
    tasks = []

    for line in plan.splitlines():

        line = line.strip()

        if not line:
            continue

        if line[0].isdigit():
            task = line.split(".", 1)[-1].strip()
            tasks.append(task)

    # Step 3: Research every task
    findings = []

    for task in tasks:

        result = research_task(task)

        findings.append({
            "task": task,
            "findings": result["findings"],
            "sources": result["sources"]
        })

    # Step 4: Combine research findings
    combined_findings = ""

    for item in findings:

        combined_findings += f"""
Research Task:
{item["task"]}

Findings:
{item["findings"]}

Sources:
{item["sources"]}

====================================
"""

    # Step 5: Collect all sources
    sources = []

    for item in findings:
        sources.extend(item["sources"])

    # Step 6: Fact-check the research
    fact_check_result = fact_check(combined_findings)

    # Step 7: Write the final report
    final_report = write_report(
        combined_findings,
        fact_check_result
    )

    # Step 8: Review the final report
    review_result = review_report(final_report)

    # Step 9: Return complete workflow
    return {
        "question": question,
        "plan": plan,
        "findings": findings,
        "fact_check": fact_check_result,
        "final_report": final_report,
        "review": review_result,
        "sources": sources
    }