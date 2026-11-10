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

# Why didn't the errors inside your try/catch reach setupExpressErrorHandler by themselves?

When an error occurs inside a try/catch block, JavaScript catches it.

# Several requests failed for the same reason. Did Sentry show them as separate issues, or group them? Why is that useful?

Sentry grouped them together into a single issue. It stops you from being spammed.

# Explain the difference between a breadcrumb and a tag in your own words. Give one example of when each one would help your team.

- Breadcrumb: A trail of events leading up to the error. Example: Seeing the exact way a user interacts before error occurs.
- Tag: A key-value label connected to an error. Example: Tagging errors with feature:books or feature:authors so you can easily find the place of the error.

# You now send each error to Sentry. What does each tool give you that the other doesn't?

- Console: Fast feedback in the terminal during development.
- Sentry: Centralized error handling.