## What does docker ps show you? Which columns tell you that SonarQube is running, and on which port?

It shows me the ruining containers 
8fa998e34f29   sonarqube               "/opt/sonarqube/dock…"   2 minutes ago   Up 2 minutes   0.0.0.0:9000->9000/tcp, [::]:9000->9000/tcp        my-sonarqube

## Why run SonarQube in Docker instead of installing it directly on your computer?
Well because it now can be reused if you wanna create a new dev env, It also make a stand alone app that don't have to interact with the underlying host

## Did your project pass or fail the quality gate? How many issues did SonarQube find?
Pass one issue


## Issue: Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator.

### File & Line: index.js, line 20

testDatabaseConnection is an async function, so calling it always return a promise
On line 20, testDatabaseConnection() is called without anything to handle the promise


await testDatabaseConnection();

testDatabaseConnection().catch((err) => {
    console.error("Database connection check failed:", err);
});


## whether you agree that it's a problem, and why:
well it is a bug to not include a await, but it is already wrapping it's body in a try/catch, so it is not that big of a deal



## Question: Depending on the version, SonarQube groups issues either by the quality they affect (Security, Reliability, Maintainability) or by type (Vulnerability, Bug, Code Smell). Explain each of the three groups your SonarQube uses, with an example:

Security: Code that makes your code vulnerable to malicious actors. example: hardcoded API keys

Reliability: Bugs or risky logic that can create unintended consequences. example: async function without await

Maintainability: Code that works, but is not easy to read, understand or test. example Duplicated code blocks across routes or unused variables



## Question: SonarQube, your tests and Sentry all help you find problems. What does each one find that the others can't?
SonarQube: Finds structural, style, and security/reliability problems without ruining the code

Tests: Finds logic bugs that don't crash the code

Sentry: Finds real world production failures