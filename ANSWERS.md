# Why must instrument.js be imported before everything else?

Sentry works in the Node.js core modules, so it has to be loaded first so it can hook into the other modules and catch errors.


# Why do we keep the DSN in .env instead of in the code?

because it contains a secret.

# Issue Details (from your dashboard for /debug-sentry)

File and line number: index.js:332:11
Node.js version: node v27.0.0-alpha.0.0.0
Operating system: Arch Linux "rolling"
Environment: production


# You didn't add any extra information to this error yourself. List everything Sentry recorded anyway:

Stack Trace & Source Code, Breadcrumbs, HTTP Request, Runtime & System Information, Event Metadata

# What happened when the handler was above the routes, and why?

nothing is sent to Sentry because Express looks forward down the middleware chain for error-handling middleware, Express cant look backwards.

