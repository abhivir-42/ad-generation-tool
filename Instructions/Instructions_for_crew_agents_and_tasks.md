Write your own agents and tasks for the crew to execute on the script generation project as described in the instructions.

The below format of code can be used and you don't need to write the same agents, you should think of what agents and tasks are needed for the project.



# script_generation/crew.py
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pathlib import Path

@CrewBase
class ScriptGeneration():
    """ScriptGeneration crew for generating ad script and art direction"""

    # Load the YAML configuration files for agents and tasks.
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    # Define the ad script generator agent.
    @agent
    def ad_script_generator(self) -> Agent:
        return Agent(
            config=self.agents_config['ad_script_generator'],
            verbose=True
        )

    # Define the task to generate the ad script.
    @task
    def ad_script_task(self) -> Task:
        output_path = Path(__file__).parent.parent.parent / 'radio_script.md'
        return Task(
            config=self.tasks_config['ad_script_task'],
            output_file=str(output_path)
        )

    @crew
    def crew(self) -> Crew:
        """Creates the ScriptGeneration crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,    # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )


# config/agents.yaml
ad_script_generator:
  role: >
    Radio Script & Voice Director
  goal: >
    Create compelling radio ad scripts with voice direction for each line
  backstory: >
    As a seasoned radio producer, you specialize in crafting impactful audio advertisements 
    that pair script lines with specific vocal delivery instructions. Your expertise includes 
    tone, pacing, and emotional inflection for maximum audience engagement.

art_direction_generator:
  role: >
    Art Direction Generator
  goal: >
    Generate detailed art direction guidelines that complement the ad script.
  backstory: >
    You are an experienced art director known for innovative visual design.
    Given the ad script and the product/service details (niche, keywords, target audience), your job is 
    to provide recommendations on visual style, color palette, typography, and layout to enhance the 
    advertising campaign.

# config/tasks.yaml
ad_script_task:
  description: >
    Create a radio ad script with voice direction using:
    Niche: {niche}
    Keywords: {keywords}
    Target Audience: {audience}
    Each script line must include vocal direction (tone, pace, emphasis).
  expected_output: >
    List of tuples formatted as:
    [
      ("Line 1 text", "Voice direction for line 1"),
      ("Line 2 text", "Voice direction for line 2"),
      ...
    ]
  agent: ad_script_generator
  tools: []
  context: []
  # Add explicit input variables
  inputs:
    - niche
    - keywords
    - audience