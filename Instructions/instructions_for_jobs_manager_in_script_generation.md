#!/usr/bin/env python
import sys
import warnings
from datetime import datetime
import os
import json
from script_generation.crew import ScriptGeneration

# For testing, we're setting the OpenAI API key directly.
os.environ["OPENAI_API_KEY"] = "key"

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run(inputs: dict):
    """
    Run the crew with inputs for generating an ad script and art direction.
    """
    try:
        # Kick off the crew; tasks run sequentially.
        ScriptGeneration().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "niche": "Eco-Friendly Cleaning Products",
        "keywords": "green, sustainable, non-toxic, organic",
        "audience": "environmentally conscious consumers"
    }
    try:
        ScriptGeneration().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        ScriptGeneration().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "niche": "Eco-Friendly Cleaning Products",
        "keywords": "green, sustainable, non-toxic, organic",
        "audience": "environmentally conscious consumers"
    }
    try:
        ScriptGeneration().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

if __name__ == '__main__':
    # If the backend or another caller provides input via
    # an environment variable, use it.
    input_str = os.environ.get("CREW_INPUTS")
    if input_str:
        try:
            inputs = json.loads(input_str)
        except json.JSONDecodeError:
            print("Invalid JSON in CREW_INPUTS environment variable.")
            sys.exit(1)
    elif len(sys.argv) > 1:
        # Fallback: allow testing by passing a JSON string as an argument.
        try:
            inputs = json.loads(sys.argv[1])
        except json.JSONDecodeError:
            print("Invalid JSON argument provided.")
            sys.exit(1)
    else:
        print("No input provided. Please supply a JSON string as a command-line argument or set the CREW_INPUTS environment variable.")
        sys.exit(1)
    
    run(inputs)


The above provided code is an excellent starting point for building a robust backend that integrates CrewAI into your project. 

the jobs_manager.py file in your CrewAI backend project can serve as the "main" file for managing and orchestrating the execution of CrewAI tasks. It acts as the entry point for running, training, testing, or replaying your CrewAI workflows. This file centralizes the logic for interacting with your CrewAI implementation and provides a way to manage background jobs, status updates, and task execution.The code you provided is an excellent example of what could go into such a file. Let me break it down further and clarify its purpose:

## **Purpose of `jobs_manager.py`**

- **Centralized Management**: This file serves as the main interface for managing CrewAI workflows. It includes functions to:
    - Run a crew with specified inputs.
    - Train the crew with iterative improvements.
    - Replay specific tasks for debugging or refinement.
    - Test the crew's behavior under specific conditions.
- **Background Job Management**: In production, this file could be extended to integrate with a job queue (e.g., Celery, Redis Queue) to handle long-running tasks asynchronously.
- **Status Updates**: It could also track the status of each task or workflow (e.g., "in progress," "completed," "failed") and log results for debugging or monitoring.

## **Does This File Act Like the Main File in Traditional CrewAI Projects?**

Yes, this file is conceptually similar to the "main" file in traditional CrewAI projects. It provides a single entry point for interacting with your CrewAI implementation and defines how different functionalities (like running or training crews) should be executed.In your case, jobs_manager.py is tailored to:

1. Accept inputs via environment variables or command-line arguments.
2. Call specific methods on your **`ScriptGeneration`** crew to perform tasks like **`kickoff`**, **`train`**, **`replay`**, or **`test`**.
3. Handle exceptions gracefully and provide meaningful error messages.

## **How Does the Provided Code Fit?**

The code you shared is well-suited for a jobs_manager.py file. Here's how it aligns with its purpose:

## **Key Features of Your Code**

1. **Environment Variable Support**:
    - The code reads inputs from an environment variable (**`CREW_INPUTS`**) or command-line arguments, making it flexible for both local testing and deployment in production environments.
2. **Task-Oriented Functions**:
    - Functions like **`run()`**, **`train()`**, **`replay()`**, and **`test()`** encapsulate specific CrewAI operations, keeping the code modular and easy to maintain.
3. **Error Handling**:
    - Exceptions are caught and raised with detailed error messages, which is essential for debugging during development and monitoring in production.
4. **JSON Input Parsing**:
    - The code ensures that inputs are properly parsed as JSON before being passed to the crew, reducing the risk of runtime errors.
5. **CLI-Friendly**:
    - By supporting command-line arguments, the script can be run directly from the terminal for quick testing or debugging.

## **How to Extend This File**

If you're planning to use this in production, you might want to extend it with additional features:

## **1. Logging**

Integrate logging for better observability:

`pythonimport logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run(inputs):
    logger.info(f"Running crew with inputs: {inputs}")
    try:
        ScriptGeneration().crew().kickoff(inputs=inputs)
        logger.info("Crew completed successfully.")
    except Exception as e:
        logger.error(f"Error occurred: {e}")
        raise`

## **Environment Setup**

1. **Development Environment**:
    - Ensure you have a Python virtual environment where CrewAI tools are installed.
    - Install dependencies using **`pip install crewai flask`** (or any other required libraries).
    - Use **`.env`** files to manage environment variables securely during development.
2. **Production Environment**:
    - Use Docker to containerize your application along with its dependencies.
    - Create a **`Dockerfile`** like this:
        
        `textFROM python:3.9-slim
        WORKDIR /app
        COPY . .
        RUN pip install --no-cache-dir -r requirements.txt
        CMD ["python", "jobs_manager.py"]`
        
    - Use environment variables (e.g., via AWS Secrets Manager or **`.env`** files) to securely pass sensitive information like API keys.

## **Deployment**

1. **Containerization**:Use Docker to package your backend application and deploy it on platforms like AWS ECS, Google Cloud Run, or Kubernetes.