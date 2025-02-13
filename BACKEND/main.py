from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn

from script_generation.jobs_manager import JobsManager

app = FastAPI(
    title="Ad Script Generator API",
    description="API for generating and refining ad scripts with art direction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize jobs manager
jobs_manager = JobsManager()

class ScriptRequest(BaseModel):
    niche: str
    keywords: str
    audience: str

class ScriptRefinementRequest(BaseModel):
    script: str
    feedback: str
    original_inputs: Dict

@app.post("/generate-script")
async def generate_script(request: ScriptRequest):
    """
    Generate an ad script with art direction based on the provided inputs.
    """
    try:
        inputs = {
            "niche": request.niche,
            "keywords": request.keywords,
            "audience": request.audience
        }
        result = jobs_manager.run(inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refine-script")
async def refine_script(request: ScriptRefinementRequest):
    """
    Refine an existing script based on feedback.
    """
    try:
        result = jobs_manager.refine_script(
            script=request.script,
            feedback=request.feedback,
            inputs=request.original_inputs
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 