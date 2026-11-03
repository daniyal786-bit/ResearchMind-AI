
/* =====================================================
   RESEARCHMIND AI - COMPLETE FRONTEND SCRIPT
   Includes:
   - Navigation
   - Research API connection
   - Five-agent pipeline
   - Report generation
   - Markdown formatting
   - Intelligence Center
   - Fact Checking
   - Sources
   - Copy Report
   - Loading and Error Handling
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const API_BASE_URL = "http://127.0.0.1:8000";
const RESEARCH_ENDPOINT = `${API_BASE_URL}/research/report`;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const questionInput = document.getElementById("research-question");
const startButton = document.getElementById("start-research-btn");
const newResearchButton = document.getElementById("new-research-btn");
const copyReportButton = document.getElementById("copy-report-btn");

const loadingOverlay = document.getElementById("loading-overlay");
const loadingMessage = document.getElementById("loading-message");

const resultsSection = document.getElementById("results-section");
const reportSection = document.getElementById("report-section");
const pipelineStatusText = document.getElementById("pipeline-status-text");

const navItems = document.querySelectorAll(".nav-item");
const pageSections = document.querySelectorAll(".page-section");


/* =====================================================
   AGENT CONFIGURATION
===================================================== */

const agents = [
    "agent-planner",
    "agent-researcher",
    "agent-factchecker",
    "agent-writer",
    "agent-reviewer"
];

const agentMessages = [
    "Creating research strategy...",
    "Searching and analyzing web sources...",
    "Checking evidence and claims...",
    "Writing intelligence report...",
    "Reviewing report quality..."
];

let animationTimer = null;
let currentAgentIndex = 0;
let latestResearchResult = null;


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    resetPipeline();
    setupNavigation();
    setupResearchControls();
    fixAgentPipelineLayout();
});


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    navItems.forEach((item) => {

        item.addEventListener("click", () => {
            showSection(item.dataset.section);
        });

    });

    document.querySelectorAll("[data-go-section]").forEach((button) => {

        button.addEventListener("click", () => {
            showSection(button.dataset.goSection);
        });

    });

}


function showSection(sectionId) {

    const targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    pageSections.forEach((section) => {
        section.classList.add("hidden");
        section.classList.remove("active-section");
    });

    targetSection.classList.remove("hidden");
    targetSection.classList.add("active-section");

    navItems.forEach((item) => {

        item.classList.remove("active");

        if (item.dataset.section === sectionId) {
            item.classList.add("active");
        }

    });

    updateBreadcrumb(sectionId);

    if (sectionId === "intelligence-section") {
        displayIntelligence();
    }

    if (sectionId === "fact-checking-section") {
        displayFactChecking();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function updateBreadcrumb(sectionId) {

    const breadcrumb = document.querySelector(".breadcrumb");

    if (!breadcrumb) return;

    const names = {
        "research-section": "ResearchMind AI / Research",
        "intelligence-section": "ResearchMind AI / Intelligence",
        "fact-checking-section": "ResearchMind AI / Fact Checking",
        "about-section": "ResearchMind AI / About"
    };

    breadcrumb.textContent = names[sectionId] || "ResearchMind AI";

}


/* =====================================================
   RESEARCH CONTROLS
===================================================== */

function setupResearchControls() {

    if (startButton) {
        startButton.addEventListener("click", startResearch);
    }

    if (newResearchButton) {
        newResearchButton.addEventListener("click", resetResearch);
    }

    if (copyReportButton) {
        copyReportButton.addEventListener("click", copyReport);
    }

    if (questionInput) {

        questionInput.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" &&
                (event.ctrlKey || event.metaKey)
            ) {
                event.preventDefault();
                startResearch();
            }

        });

    }

}


/* =====================================================
   START RESEARCH
===================================================== */

async function startResearch() {

    if (!questionInput || !startButton) return;

    const question = questionInput.value.trim();

    if (!question) {

        questionInput.focus();
        questionInput.style.borderColor = "rgba(251, 113, 133, 0.7)";

        setTimeout(() => {
            questionInput.style.borderColor = "";
        }, 1500);

        return;
    }

    showSection("research-section");

    startButton.disabled = true;

    const buttonText = startButton.querySelector("span");

    if (buttonText) {
        buttonText.textContent = "Researching...";
    }

    showLoading();
    resetPipeline();
    startPipelineAnimation();

    try {

        const response = await fetch(RESEARCH_ENDPOINT, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })

        });

        if (!response.ok) {

            let errorMessage = `Server returned HTTP ${response.status}.`;

            try {

                const errorData = await response.json();

                if (errorData.detail) {
                    errorMessage = errorData.detail;
                }

            } catch (error) {
                // Ignore JSON parsing errors.
            }

            throw new Error(errorMessage);
        }

        const result = await response.json();

        latestResearchResult = result;

        completePipeline();

        displayReport(result);
        displayIntelligence();
        displayFactChecking();

    } catch (error) {

        console.error("ResearchMind error:", error);

        stopPipelineAnimation();

        showError(
            error.message ||
            "Something went wrong while running the research workflow."
        );

    } finally {

        hideLoading();

        startButton.disabled = false;

        if (buttonText) {
            buttonText.textContent = "Start Research";
        }

    }

}


/* =====================================================
   FIVE-AGENT PIPELINE
===================================================== */

function resetPipeline() {

    stopPipelineAnimation();

    agents.forEach((agentId, index) => {

        const element = document.getElementById(agentId);

        if (!element) return;

        element.classList.remove("active", "completed");

        const state = element.querySelector(".agent-state");

        if (state) {
            state.textContent = index === 0 ? "Ready" : "Waiting";
        }

    });

    currentAgentIndex = 0;

    if (pipelineStatusText) {
        pipelineStatusText.textContent = "Ready";
    }

}


function startPipelineAnimation() {

    stopPipelineAnimation();

    currentAgentIndex = 0;

    activateAgent(currentAgentIndex);

    animationTimer = setInterval(() => {

        const previousIndex = currentAgentIndex;
        const nextIndex = currentAgentIndex + 1;

        if (nextIndex >= agents.length) {
            stopPipelineAnimation();
            return;
        }

        completeAgent(previousIndex);

        currentAgentIndex = nextIndex;

        activateAgent(currentAgentIndex);

    }, 2000);

}


function activateAgent(index) {

    const element = document.getElementById(agents[index]);

    if (!element) return;

    element.classList.remove("completed");
    element.classList.add("active");

    const state = element.querySelector(".agent-state");

    if (state) {
        state.textContent = "Working";
    }

    const message = agentMessages[index] || "Processing...";

    if (pipelineStatusText) {
        pipelineStatusText.textContent = message;
    }

    if (loadingMessage) {
        loadingMessage.textContent = message;
    }

}


function completeAgent(index) {

    const element = document.getElementById(agents[index]);

    if (!element) return;

    element.classList.remove("active");
    element.classList.add("completed");

    const state = element.querySelector(".agent-state");

    if (state) {
        state.textContent = "Completed";
    }

}


function completePipeline() {

    stopPipelineAnimation();

    agents.forEach((agentId) => {

        const element = document.getElementById(agentId);

        if (!element) return;

        element.classList.remove("active");
        element.classList.add("completed");

        const state = element.querySelector(".agent-state");

        if (state) {
            state.textContent = "Completed";
        }

    });

    if (pipelineStatusText) {
        pipelineStatusText.textContent = "Research complete";
    }

}


function stopPipelineAnimation() {

    if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
    }

}


/* =====================================================
   REPORT DISPLAY
===================================================== */

function displayReport(result) {

    if (!reportSection) return;

    if (resultsSection) {
        resultsSection.classList.add("hidden");
    }

    reportSection.classList.remove("hidden");

    const report =
        result.final_report ||
        result.report ||
        "";

    const factCheck = result.fact_check || "";
    const review = result.review || "";

    const sections = parseReport(report);

    setContent(
        "executive-summary",
        sections.executiveSummary ||
        "No executive summary was returned."
    );

    setContent(
        "key-findings",
        sections.keyFindings ||
        "No key findings were returned."
    );

    setContent(
        "detailed-analysis",
        sections.detailedAnalysis ||
        report
    );

    setContent(
        "conflicting-information",
        sections.conflictingInformation ||
        "No conflicting information was explicitly identified."
    );

    setContent(
        "conclusion",
        sections.conclusion ||
        "No conclusion was returned."
    );

    setContent(
        "fact-check-result",
        factCheck ||
        "No fact-checking result was returned."
    );

    setContent(
        "review-result",
        review ||
        "No review result was returned."
    );

    displaySources(result.sources || []);

    window.currentResearchReport = report;

}


/* =====================================================
   REPORT PARSER
===================================================== */

function parseReport(report) {

    const sections = {
        executiveSummary: "",
        keyFindings: "",
        detailedAnalysis: "",
        conflictingInformation: "",
        conclusion: ""
    };

    if (!report) return sections;

    const lines = report.split("\n");

    let currentSection = null;

    for (const line of lines) {

        const normalized = line.trim().toLowerCase();

        if (normalized.includes("executive summary")) {
            currentSection = "executiveSummary";
            continue;
        }

        if (normalized.includes("key findings")) {
            currentSection = "keyFindings";
            continue;
        }

        if (normalized.includes("detailed analysis")) {
            currentSection = "detailedAnalysis";
            continue;
        }

        if (normalized.includes("conflicting information")) {
            currentSection = "conflictingInformation";
            continue;
        }

        if (normalized.includes("conclusion")) {
            currentSection = "conclusion";
            continue;
        }

        if (currentSection) {
            sections[currentSection] += line + "\n";
        }

    }

    Object.keys(sections).forEach((key) => {
        sections[key] = sections[key].trim();
    });

    return sections;

}


/* =====================================================
   MARKDOWN RENDERER
   Converts Markdown into formatted HTML.
===================================================== */

function renderMarkdown(text) {

    if (!text) return "";

    // Escape HTML before converting Markdown.
    const lines = escapeHTML(String(text))
        .replace(/\r\n/g, "\n")
        .split("\n");

    const output = [];

    let inList = false;
    let inTable = false;
    let listType = "ul";

    function formatInline(value) {

        return value

            // Markdown links
            .replace(
                /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
            )

            // Bold text
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/__(.+?)__/g, "<strong>$1</strong>")

            // Italic text
            .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
            .replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>")

            // Inline code
            .replace(/`([^`]+)`/g, "<code>$1</code>");

    }


    function closeList() {

        if (inList) {
            output.push(`</${listType}>`);
            inList = false;
        }

    }


    function closeTable() {

        if (inTable) {
            output.push("</tbody></table></div>");
            inTable = false;
        }

    }


    function getCells(line) {

        return line.trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((cell) => cell.trim());

    }


    function isTableSeparator(line) {

        const cells = getCells(line);

        return (
            cells.length > 1 &&
            cells.every((cell) => /^:?-{3,}:?$/.test(cell))
        );

    }


    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];
        const trimmed = line.trim();

        // Empty lines
        if (!trimmed) {
            closeList();
            closeTable();
            continue;
        }

        // Horizontal dividers
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {

            closeList();
            closeTable();

            output.push("<hr>");

            continue;
        }

        // Markdown tables
        if (
            !inTable &&
            trimmed.includes("|") &&
            i + 1 < lines.length &&
            lines[i + 1].includes("|") &&
            isTableSeparator(lines[i + 1])
        ) {

            closeList();

            const headers = getCells(line);

            output.push(
                "<div class='report-table-wrap'><table class='report-table'><thead><tr>"
            );

            headers.forEach((cell) => {
                output.push(`<th>${formatInline(cell)}</th>`);
            });

            output.push("</tr></thead><tbody>");

            inTable = true;

            i++;

            continue;
        }

        // Table rows
        if (inTable && trimmed.includes("|")) {

            const cells = getCells(line);

            output.push("<tr>");

            cells.forEach((cell) => {
                output.push(`<td>${formatInline(cell)}</td>`);
            });

            output.push("</tr>");

            continue;
        }

        closeTable();

        // Headings
        const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);

        if (heading) {

            closeList();

            const level = heading[1].length;

            output.push(
                `<h${level}>${formatInline(heading[2])}</h${level}>`
            );

            continue;
        }

        // Bullet lists
        const bullet = trimmed.match(/^[-*+]\s+(.+)$/);

        if (bullet) {

            if (!inList || listType !== "ul") {
                closeList();
                listType = "ul";
                output.push("<ul>");
                inList = true;
            }

            output.push(`<li>${formatInline(bullet[1])}</li>`);

            continue;
        }

        // Numbered lists
        const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);

        if (numbered) {

            closeList();

            output.push(
                `<p>${formatInline(trimmed)}</p>`
            );

            continue;
        }

        closeList();

        // Normal paragraph
        output.push(
            `<p>${formatInline(trimmed)}</p>`
        );

    }

    closeList();
    closeTable();

    return output.join("\n");

}


/* =====================================================
   CONTENT HELPERS
===================================================== */

function setContent(elementId, content) {

    const element = document.getElementById(elementId);

    if (!element) return;

    element.innerHTML = renderMarkdown(content || "");

}


function formatAgentText(text) {

    return renderMarkdown(text || "");

}


/* =====================================================
   INTELLIGENCE CENTER
===================================================== */

function displayIntelligence() {

    const container = document.getElementById("intelligence-content");

    if (!container) return;

    if (!latestResearchResult) {

        container.innerHTML = `
            <div class="placeholder-icon">◈</div>

            <h2>Intelligence reports</h2>

            <p>
                Complete a research task to generate
                an intelligence report. Your latest
                report will appear here.
            </p>

            <button
                class="primary-button"
                data-go-section="research-section"
            >
                Start Research →
            </button>
        `;

        attachInternalNavigation();

        return;
    }

    const report =
        latestResearchResult.final_report ||
        latestResearchResult.report ||
        "";

    const question =
        latestResearchResult.question ||
        "Research Query";

    const sources =
        latestResearchResult.sources ||
        [];

    const preview =
        report.length > 900
            ? report.substring(0, 900) + "..."
            : report;

    container.innerHTML = `

        <div class="intelligence-result">

            <div class="intelligence-result-header">

                <div>

                    <span class="section-label">
                        LATEST INTELLIGENCE
                    </span>

                    <h2>
                        ${escapeHTML(question)}
                    </h2>

                </div>

                <span class="secure-badge">
                    Report Ready
                </span>

            </div>

            <div class="intelligence-preview">
                ${renderMarkdown(preview)}
            </div>

            <div class="intelligence-meta">

                <span>
                    ◈ Multi-Agent Analysis
                </span>

                <span>
                    ↗ ${sources.length} Sources
                </span>

            </div>

            <button
                class="primary-button"
                id="open-full-report-btn"
            >
                Open Full Report →
            </button>

        </div>

    `;

    const openButton = document.getElementById("open-full-report-btn");

    if (openButton) {

        openButton.addEventListener("click", () => {

            showSection("research-section");

            if (reportSection) {

                reportSection.classList.remove("hidden");

                reportSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    }

}


/* =====================================================
   FACT CHECKING CENTER
===================================================== */

function displayFactChecking() {

    const container = document.getElementById("fact-checking-content");

    if (!container) return;

    if (!latestResearchResult) {

        container.innerHTML = `

            <div class="placeholder-icon">✓</div>

            <h2>Fact-checking results</h2>

            <p>
                Run a research task to activate the
                Fact Checker Agent. Its analysis will
                appear here after the workflow completes.
            </p>

            <button
                class="primary-button"
                data-go-section="research-section"
            >
                Start Research →
            </button>

        `;

        attachInternalNavigation();

        return;
    }

    const factCheck =
        latestResearchResult.fact_check ||
        "No fact-checking result was returned.";

    const question =
        latestResearchResult.question ||
        "Latest Research";

    container.innerHTML = `

        <div class="fact-check-result-panel">

            <div class="fact-check-header">

                <div>

                    <span class="section-label">
                        VERIFICATION RESULT
                    </span>

                    <h2>
                        Fact Checker Analysis
                    </h2>

                </div>

                <span class="verification-badge">
                    Evidence Review
                </span>

            </div>

            <div class="fact-check-query">

                <strong>
                    Research Question
                </strong>

                <p>
                    ${escapeHTML(question)}
                </p>

            </div>

            <div class="fact-check-body">
                ${formatAgentText(factCheck)}
            </div>

            <button
                class="secondary-button"
                id="return-research-btn"
            >
                Back to Research
            </button>

        </div>

    `;

    const returnButton = document.getElementById("return-research-btn");

    if (returnButton) {

        returnButton.addEventListener("click", () => {
            showSection("research-section");
        });

    }

}


/* =====================================================
   INTERNAL NAVIGATION
===================================================== */

function attachInternalNavigation() {

    document.querySelectorAll("[data-go-section]").forEach((button) => {

        button.onclick = () => {
            showSection(button.dataset.goSection);
        };

    });

}


/* =====================================================
   SOURCES
===================================================== */

function displaySources(sources) {

    const container = document.getElementById("sources-container");
    const count = document.getElementById("source-count");

    if (!container) return;

    container.innerHTML = "";

    if (!sources.length) {

        container.innerHTML = `
            <div class="source-card">
                <h5>No sources were returned.</h5>
            </div>
        `;

        if (count) {
            count.textContent = "0 Sources";
        }

        return;
    }

    if (count) {

        count.textContent =
            `${sources.length} Source${sources.length === 1 ? "" : "s"}`;

    }

    sources.forEach((source, index) => {

        const card = document.createElement("div");

        card.className = "source-card";

        const title = escapeHTML(
            source.title || `Source ${index + 1}`
        );

        const url = source.url || "#";

        card.innerHTML = `

            <h5>${title}</h5>

            <a
                href="${escapeAttribute(url)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open source →
            </a>

        `;

        container.appendChild(card);

    });

}


/* =====================================================
   SECURITY HELPERS
===================================================== */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = String(value);

    return div.innerHTML;

}


function escapeAttribute(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =====================================================
   COPY REPORT
===================================================== */

async function copyReport() {

    const report = window.currentResearchReport || "";

    if (!report) return;

    try {

        await navigator.clipboard.writeText(report);

        const originalText = copyReportButton.textContent;

        copyReportButton.textContent = "Copied ✓";

        setTimeout(() => {

            copyReportButton.textContent = originalText;

        }, 1500);

    } catch (error) {

        console.error("Copy failed:", error);

    }

}


/* =====================================================
   LOADING
===================================================== */

function showLoading() {

    if (!loadingOverlay) return;

    loadingOverlay.classList.remove("hidden");

    if (loadingMessage) {
        loadingMessage.textContent = "Initializing research agents...";
    }

}


function hideLoading() {

    if (!loadingOverlay) return;

    loadingOverlay.classList.add("hidden");

}


/* =====================================================
   ERROR HANDLING
===================================================== */

function showError(message) {

    if (resultsSection) {

        resultsSection.classList.remove("hidden");

        resultsSection.innerHTML = `

            <div class="results-empty">

                <div class="empty-icon">
                    ⚠
                </div>

                <h3>
                    Research could not be completed
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;

    }

    if (reportSection) {
        reportSection.classList.add("hidden");
    }

    if (pipelineStatusText) {
        pipelineStatusText.textContent = "Research failed";
    }

}


/* =====================================================
   RESET RESEARCH
===================================================== */

function resetResearch() {

    resetPipeline();

    latestResearchResult = null;

    window.currentResearchReport = "";

    if (questionInput) {
        questionInput.value = "";
        questionInput.focus();
    }

    if (reportSection) {
        reportSection.classList.add("hidden");
    }

    if (resultsSection) {

        resultsSection.classList.remove("hidden");

        resultsSection.innerHTML = `

            <div class="results-empty">

                <div class="empty-icon">
                    ✦
                </div>

                <h3>
                    Your intelligence report will appear here
                </h3>

                <p>
                    Start a research task to activate the
                    multi-agent pipeline.
                </p>

            </div>

        `;

    }

    displayIntelligence();
    displayFactChecking();

    showSection("research-section");

}


/* =====================================================
   FIVE-AGENT PIPELINE LAYOUT
===================================================== */

function fixAgentPipelineLayout() {

    const agentElements = agents
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (agentElements.length !== 5) {
        console.warn("ResearchMind: Could not find all five agent cards.");
        return;
    }

    let container = agentElements[0].parentElement;

    while (
        container &&
        !agentElements.every((agent) => container.contains(agent))
    ) {
        container = container.parentElement;
    }

    if (!container) {
        console.warn("ResearchMind: Agent pipeline container not found.");
        return;
    }

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(5, minmax(0, 1fr))";
    container.style.gap = "14px";
    container.style.width = "100%";
    container.style.alignItems = "stretch";

    agentElements.forEach((agent) => {

        agent.style.width = "100%";
        agent.style.minWidth = "0";
        agent.style.margin = "0";
        agent.style.gridColumn = "auto";
        agent.style.gridRow = "auto";

    });

    console.log("ResearchMind: Five-agent pipeline layout applied.");

}


/* =====================================================
   END OF SCRIPT
===================================================== */
