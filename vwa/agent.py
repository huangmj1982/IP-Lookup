from veadk import Agent

# Define the Agent
agent = Agent(
    name="TestAgent",
    description="An assistant that help users.",
    # agent prompt / instruction
    instruction="You are a helpful assistant that help users.",
)

# Tell veadk web to use this agent, veadk web will use this root_agent and init Runner to run the agent in web
root_agent = agent