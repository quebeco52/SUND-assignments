

1. Automation, It follows the exact same fixed schedule

2. Agent. The bot has a goal and must decide what information is missing

3. Automation. the workflow runs the exact same fixed sequence every night

4. Automation. It is a simple fixed trigger and action rule

5. Agent. The assistant inspects multiple changing sources and decides how to combine them

6. Automation. Every form submission triggers the same two predetermined steps in the same order










## Question: Scenario 3 uses AI but is still not an agent. Explain why, using the video's example of the Reddit summary.

Is still an automation because every step is decided in advance.

## Question: The video says: "Build the simplest thing that works." Why is an automation often a better choice than an agent? Think about cost, speed, and how easy it is to test.

An automation is often better because it is cheaper, faster, and much easier to test and debug.

## Question: What happened when the context window was 1, and when there was no memory? Explain what the context window length means.

The context window length sets how many recent conversation exchanges Simple Memory keeps.

## Question: Why not just set the context window to 1000? Think about what the model has to read on every message, and what that costs.

Because the LLM has to re-read the entire saved conversation history for every new message.

## Question: Which questions made the agent use the weather tool, and which didn't? Nobody told the agent when to use the tool. How did it decide?

when prompting get the weather it used the weather tool, but prompting what is 1 + 1 it did not use the code.

## Question: This is the difference between an agent and the automation from Exercise 1. Explain it using what you saw in the logs.

n an automation, every step executes in a fixed sequence regardless of the input. I could se the AI going down the path

## Question: Read the recap about MCP again. In this exercise, the weather tool only works inside n8n. What would change if OpenWeatherMap offered an MCP server instead? Name one advantage.

OpenWeatherMap's tools would be exposed using the open MCP standard, so it could be used in mant other tools.

## Question: Explain API, HTTP request and function in your own words. Use the vending machine from the video, and one example from your own Express API.

API: is the keypad on the vending machine, on express the route
HTTP request: acutely pressing the bottoms, on express it is sending a get
Function: is what what the vending machine does when pressed, in express the would be GET /books and what happens when it is reached.

## Question: What happened to your agent's answer when you changed the tool's description to something vague, like tool? Try it, then change it back.

It did not understand how to get it most of the time

## Question: Compare the answers from the bad prompt and the structured prompt. Give two concrete differences.

With help the user It was kind of vague and with a structured prompt I gave a structured respond.

## Question: Which of the six parts made the biggest difference for your agent, and why?

Output, because it structured all in a noticeable way.

## Question: Your prompt is always read by the agent, on every message. A skill is only read when a task needs it. Imagine your agent could do ten different jobs, each with a long set of rules. Why would skills be better than one huge prompt?

It is better because it will only read the skill when they need it

## Question: One of your errors may not have stopped the workflow. Instead, the agent just gave a strange or wrong answer. Why is that kind of error more dangerous than a red error message?

A red error message stops the workflow immediately and makes it obvious that something failed.

## Question: You learned to read error reports in the Sentry week. What is similar about finding errors in n8n, and what is different?

Similar: Both give you a central log/history of runs and failures.
Different: Sentry captures live code exceptions and shows JavaScript stack traces with exact file names.





| What I broke | Which node failed | Error message (short) | What the message told me |
| --- | --- | --- | --- |
| Get weather api | Get weather | NodeApiError: Authorization failed | I could not Authorization |
| city format | Get weather | odeApiError: The resource you are requesting could not be found | I cant find the info |
| the url to Get air quality | Get air quality | The connection cannot be established | it cant reach the url |