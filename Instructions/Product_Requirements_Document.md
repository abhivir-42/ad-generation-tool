# Project Requirements Document (PRD)

## Project Name: AI-Powered Ad Script Generator

### 1. Overview

The AI-Powered Ad Script Generator is a web-based application that helps marketing teams and startups iteratively generate and refine ad scripts with integrated AI agents. Users interact via a chat interface to provide essential inputs (product name, target audience, ad duration, etc.), and the system generates structured scripts with corresponding art direction. Users can further refine and edit scripts within the web app.

### 2. Objectives

- Provide an interactive, professional, and intuitive UI for script generation.
- Utilize LLM-powered AI agents to iteratively refine ad scripts.
- Allow users to modify and improve scripts through a collaborative chat interface.
- Support art direction generation based on the script.
- Ensure seamless frontend-backend interaction for fast response times.
- Deploy efficiently with version control best practices.

### 3. Key Features

### **Frontend (React + Next.js + TailwindCSS)**

- Chat-based interaction for input and refinement.
- Script display and inline editing.
- Selective refinement of script parts with an AI agent.
- Responsive, professional design with TailwindCSS.
- Seamless user experience with smooth transitions and animations.

### **Backend (FastAPI)**

- API endpoints for AI-generated scripts and refinements.
- CrewAI-powered LLM task orchestration.
- Authentication and session management (optional, for team collaboration).
- Efficient processing and logging of script iterations.

### **AI Logic (CrewAI)**

- **Script Generation Agent**: Takes user input and generates an initial ad script.
- **Script Refinement Agent**: Enhances specific parts of the script based on user requests.
- **Art Direction Agent**: Suggests art directions based on the ad script.
- **Coordinator Agent**: Ensures task distribution and smooth workflow.

### 4. Technology Stack

- **Frontend:** React (Next.js), TailwindCSS
- **Backend:** FastAPI
- **AI Orchestration:** CrewAI
- **LLM Integration:** OpenAI API 
- **Deployment:** Vercel (Frontend), Vercel (Backend)

### 5. Deployment Strategy

- **Vercel for Frontend Deployment** (Auto-deployment on commits to `main` branch).
- **Backend Deployment Options:** Vercel (if feasible) or Fly.io for more flexibility.
- **Version Control & CI/CD**: GitHub/GitLab with automated testing before deployment.

### 6. Next Steps

1. Develop a detailed technical specification document.
2. Define the CrewAI agent behaviors and interactions.
3. Implement the core system following a structured development plan.
4. Test with real-world use cases.
5. Deploy and iterate based on feedback.