# AI-Powered Ad Script Generator

An interactive web application for generating and refining ad scripts using AI agents. The tool allows marketing teams and startups to iteratively create, edit, and enhance scripts through a chat-based interface.

## Features

- Generate professional ad scripts with voice direction
- Get comprehensive art direction guidelines
- Refine specific parts of the script with AI assistance
- Modern, responsive UI built with Next.js and TailwindCSS
- Powerful backend powered by FastAPI and CrewAI

## Project Structure

```
.
├── BACKEND/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── script_generation/
│       ├── crew.py            # CrewAI implementation
│       ├── jobs_manager.py    # Background job management
│       ├── config/
│       │   ├── agents.yaml    # AI agent configurations
│       │   └── tasks.yaml     # Task configurations
│       └── knowledge/
│           └── user_preference.txt  # User context
├── FRONTEND/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Home page
│   │   │   └── results/
│   │   │       └── page.tsx  # Results page
│   │   └── components/
│   │       ├── ScriptGenerationForm.tsx
│   │       └── ScriptResults.tsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   cd BACKEND
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the BACKEND directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd FRONTEND
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Usage

1. Visit http://localhost:3000
2. Fill in the script generation form with:
   - Product/Service Niche
   - Key Features/Keywords
   - Target Audience
3. Click "Generate Script" to create your ad script
4. Review the generated script and art direction
5. Click on any line to refine it with AI assistance
6. Provide feedback and click "Refine Line" to improve specific parts

## Development

### Backend Development

- The backend uses FastAPI for the REST API
- CrewAI orchestrates multiple AI agents:
  - Script Generator: Creates the initial ad script
  - Art Director: Provides visual guidelines
  - Script Refiner: Improves specific parts based on feedback

### Frontend Development

- Built with Next.js 13+ and TypeScript
- Uses TailwindCSS for styling
- Implements a responsive, modern UI
- Features real-time script refinement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.