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


## Question: Your package.json goes to GitHub. What could someone do with your SonarQube token if they found it there? What about a database password or a Sentry DSN?

token: Someone could authenticate as you to your SonarQube server
db pass: could connect directly to the ostgreSQL database
DSN: could spam sentry project with fake errors

## Question: Why is it better to put settings like the project key in sonar-project.properties than in a long command?

It gets tracked in git

##  Look at the Code tab in SonarQube. Which folders and files were scanned?
see screenshots

## Question: What changed in the numbers, and why? Why is it a problem when a tool reports issues in code you didn't write?
I don't think anything changed?
It is problem because the code that acutely needs to be analyzed gets buried.




| Rule | File | What I changed | Tests still green? |
| --- | --- | --- | --- |
| Prefer top-level await over promise chain (floating promise) | `sequelize.js`, `index.js` | Replaced `.then().catch()` with `connectToDatabase()` (`async`/`await` + `try`/`catch`) and awaited it at top level | Yes |
| Code duplication (ID check) | `index.js` | Extracted `validatePositiveIntId` middleware for `:id` routes | Yes |
| Code duplication (string check) | `index.js` | Extracted `isNonEmptyString` helper for title/name validation | Yes |
| Code duplication (Sentry boilerplate) | `index.js` | Extracted `trackFeature` middleware for Sentry tags and breadcrumbs | Yes |



## Why run your tests after every fix, even when the change looks small?
small changes can still cause problems

## Choose one of your fixes. Is the code easier to read now? Explain why or why not.
validatePositiveIntId: the logic now becomes the meat of the code and skips the repeated validation boilerplate