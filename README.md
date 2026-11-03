# ResearchMind-AI 🧠

**An Intelligent Multi-Agent AI Research Assistant**

ResearchMind-AI is an AI-powered research assistant designed to automate the research process using a multi-agent architecture. It helps users explore topics, gather relevant information, verify findings, and generate structured research reports.

## 🚀 Key Features

- **Multi-Agent Architecture:** Uses specialized AI agents to manage different research tasks.
- **Research Planning:** Breaks a research question into a structured research workflow.
- **Web Research:** Collects relevant information using Tavily.
- **Fact Checking:** Checks research findings for consistency and reliability.
- **AI Report Generation:** Produces organized research reports.
- **Report Review:** Reviews generated content to improve its quality.
- **Interactive Frontend:** Provides a user interface for submitting research questions and viewing reports.
- **FastAPI Backend:** Provides API endpoints for the research workflow.

## 🏗️ Multi-Agent Architecture

ResearchMind-AI follows a five-agent workflow:

1. **Planner Agent** – Creates a research plan based on the user's question.
2. **Researcher Agent** – Searches for relevant information and sources.
3. **Fact Checker Agent** – Reviews findings for accuracy and consistency.
4. **Writer Agent** – Generates a structured research report.
5. **Reviewer Agent** – Reviews the final report for quality and clarity.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| FastAPI | Backend API development |
| Groq | LLM inference |
| LangChain | LLM integration |
| Tavily | Web research |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend functionality |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
ResearchMind-AI/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── main.py
│   │   └── ...
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

*Note: The structure above is a simplified overview.*

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/ResearchMind-AI.git
cd ResearchMind-AI
```

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Create a virtual environment

```bash
python -m venv .venv
```

### 4. Activate the virtual environment

**Windows:**

```bash
.venv\Scripts\activate
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure environment variables

Create a `.env` file inside the backend folder and add your own API keys:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
TAVILY_API_KEY=your_tavily_api_key
```

Never share your actual API keys or upload your `.env` file.

### 7. Start the backend server

```bash
python -m uvicorn app.main:app --reload
```

### 8. Open the API documentation

Visit:

```text
http://127.0.0.1:8000/docs
```

### 9. Run the frontend

Open `frontend/index.html` in your browser. Ensure the backend is running so the frontend can communicate with the API.

## 🔌 API

The backend provides research functionality through FastAPI.

Main research endpoint:

```text
POST /research/report
```

Interactive API documentation:

```text
GET /docs
```

## 🎯 Project Goal

The goal of ResearchMind-AI is to demonstrate how multiple specialized AI agents can collaborate to automate research tasks and generate useful, structured reports.

## 👨‍💻 Developer

**Daniyal Asif**

- GitHub: [daniyal786-bit](https://github.com/daniyal786-bit)
- LinkedIn: [Daniyal Asif](https://linkedin.com/in/daniyal-asif-804a212b5)

---

⭐ If you find this project interesting, feel free to explore the repository!