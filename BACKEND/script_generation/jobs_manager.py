#!/usr/bin/env python
import sys
import warnings
import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

from .crew import ScriptGeneration

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Suppress pysbd warnings
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

class JobsManager:
    def __init__(self):
        self.crew = ScriptGeneration()
        
    def run(self, inputs: Dict) -> Dict:
        """
        Run the crew with inputs for generating an ad script and art direction.
        
        Args:
            inputs (Dict): Dictionary containing:
                - niche: Product/service niche
                - keywords: Key features/keywords
                - audience: Target audience
        
        Returns:
            Dict: Generated script and art direction
        """
        try:
            logger.info(f"Starting script generation with inputs: {inputs}")
            result = self.crew.kickoff(inputs=inputs)
            logger.info("Script generation completed successfully")
            return result
        except Exception as e:
            logger.error(f"An error occurred while running the crew: {e}")
            raise

    def refine_script(self, script: str, feedback: str, inputs: Dict) -> Dict:
        """
        Refine an existing script based on feedback.
        
        Args:
            script (str): Original script to refine
            feedback (str): Feedback to address
            inputs (Dict): Original input parameters
        
        Returns:
            Dict: Refined script
        """
        try:
            logger.info(f"Starting script refinement with feedback: {feedback}")
            crew = self.crew.crew()
            result = crew.execute_task(
                self.crew.refine_script(
                    script=script,
                    feedback=feedback,
                    inputs=inputs
                )
            )
            logger.info("Script refinement completed successfully")
            return result
        except Exception as e:
            logger.error(f"An error occurred while refining the script: {e}")
            raise

def main():
    """
    Main entry point for running the jobs manager from command line.
    """
    try:
        # Get inputs from environment variable or command line
        input_str = os.environ.get("CREW_INPUTS")
        if input_str:
            try:
                inputs = json.loads(input_str)
            except json.JSONDecodeError:
                logger.error("Invalid JSON in CREW_INPUTS environment variable")
                sys.exit(1)
        elif len(sys.argv) > 1:
            try:
                inputs = json.loads(sys.argv[1])
            except json.JSONDecodeError:
                logger.error("Invalid JSON argument provided")
                sys.exit(1)
        else:
            logger.error("No input provided. Please supply a JSON string as argument or set CREW_INPUTS")
            sys.exit(1)

        # Initialize and run the jobs manager
        manager = JobsManager()
        result = manager.run(inputs)
        
        # Print result as JSON
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        logger.error(f"Error in main: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
