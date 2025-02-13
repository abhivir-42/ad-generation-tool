from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pathlib import Path
import yaml

@CrewBase
class ScriptGeneration:
    """ScriptGeneration crew for generating ad script and art direction"""

    def __init__(self):
        # Load agent and task configurations
        with open(Path(__file__).parent / 'config/agents.yaml', 'r') as f:
            self.agents_config = yaml.safe_load(f)
        with open(Path(__file__).parent / 'config/tasks.yaml', 'r') as f:
            self.tasks_config = yaml.safe_load(f)

    @agent
    def script_generator(self) -> Agent:
        """Creates the script generator agent"""
        return Agent(
            role=self.agents_config['script_generator']['role'],
            goal=self.agents_config['script_generator']['goal'],
            backstory=self.agents_config['script_generator']['backstory'],
            verbose=True
        )

    @agent
    def art_director(self) -> Agent:
        """Creates the art director agent"""
        return Agent(
            role=self.agents_config['art_director']['role'],
            goal=self.agents_config['art_director']['goal'],
            backstory=self.agents_config['art_director']['backstory'],
            verbose=True
        )

    @agent
    def script_refiner(self) -> Agent:
        """Creates the script refiner agent"""
        return Agent(
            role=self.agents_config['script_refiner']['role'],
            goal=self.agents_config['script_refiner']['goal'],
            backstory=self.agents_config['script_refiner']['backstory'],
            verbose=True
        )

    @task
    def generate_script(self, inputs: dict) -> Task:
        """Task to generate the initial ad script"""
        return Task(
            description=self.tasks_config['generate_script']['description'].format(**inputs),
            agent=self.script_generator,
            expected_output=self.tasks_config['generate_script']['expected_output']
        )

    @task
    def generate_art_direction(self, script: str, inputs: dict) -> Task:
        """Task to generate art direction based on the script"""
        context = {"script": script, **inputs}
        return Task(
            description=self.tasks_config['generate_art_direction']['description'].format(**context),
            agent=self.art_director,
            expected_output=self.tasks_config['generate_art_direction']['expected_output']
        )

    @task
    def refine_script(self, script: str, feedback: str, inputs: dict) -> Task:
        """Task to refine specific parts of the script based on feedback"""
        context = {"script": script, "feedback": feedback, **inputs}
        return Task(
            description=self.tasks_config['refine_script']['description'].format(**context),
            agent=self.script_refiner,
            expected_output=self.tasks_config['refine_script']['expected_output']
        )

    @crew
    def crew(self) -> Crew:
        """Creates the ScriptGeneration crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )

    def kickoff(self, inputs: dict) -> dict:
        """Main method to kickoff the script generation process"""
        crew = self.crew()
        
        # Generate initial script
        script_result = crew.execute_task(
            self.generate_script(inputs=inputs)
        )
        
        # Generate art direction based on the script
        art_direction = crew.execute_task(
            self.generate_art_direction(script=script_result, inputs=inputs)
        )
        
        return {
            "script": script_result,
            "art_direction": art_direction
        }
