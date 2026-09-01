# Threadlight Architecture

This guide explains how Threadlight works on the inside. Read it from beginning to end, and you will understand how every piece fits together.

## What Threadlight Is

Threadlight is a social network where people share posts, form communities, build trust with one another, and make moderation decisions together as a group. There are no ads, no secret formulas designed to keep anyone glued to a screen, and no single person in charge of what stays and what goes.

The whole thing is a single program. A Go binary serves the API, and a Svelte application runs in the browser. There are no microservices, no message queues, and no extra layers of complexity. Just Go, a PostgreSQL database for permanent storage, and a Redis cache for speed.

## How the Code Is Organized

The code is divided into layers that each have a single job. The entry point lives in the cmd folder. It reads settings from the environment, connects to the database and the cache, wires together every handler and every service, creates the scheduler for background work, and starts the server listening for requests.

Below that is the internal folder, which is the real engine room. The api section contains the router and all the handlers. The router is a complete list of every web address the server responds to, paired with the handler that should handle each one. The handlers are deliberately thin. They read data from the incoming request, call a service, and send the result back as a response. They never touch the database themselves.

The services section is where all the business logic lives. Each service is a bundle of methods that handle one area of the platform. There are services for authentication, posts, tags, search, communities, moderation, trust, credits, achievements, notifications, user lists, affinity, feed plugins, and more. Every database query in the entire system lives inside these services. Services take a context with every call so they can respect timeouts and cancellations. They check permissions on every mutation to make sure the person making the request is allowed to do what they are asking.

The model section holds the shapes that represent everything in the system. There are types for posts, users, communities, tags, trust connections, notifications, and dozens more. Request types describe data coming in from the browser, and response types describe data going back out. Error types live here too — simple flags like not found, forbidden, or validation failed that tell the rest of the system what went wrong.

The db section connects to PostgreSQL and Redis and runs migration files on startup. The search section holds a parser that turns plain-language queries into structured database lookups. The worker section contains the scheduler and all the background tasks.

The web folder is a separate world built with SvelteKit. It has pages for every part of the platform. A shared API client in the front end handles all communication with the backend.

## How a Request Makes Its Journey

Every action you take in Threadlight follows the same path. You click something in your browser, and a request travels across the internet to the server. The router examines the path and the method and sends the request to the correct handler. Before the handler runs, the authentication middleware checks your token to confirm your identity and places your user id into the context for the rest of the chain to use.

The handler does exactly three things. It reads the data from the request. It calls the appropriate method on the appropriate service. And it formats the result as a response and sends it back to your browser.

Inside the service, three things happen in order. The service validates the input to make sure it is complete and correct. It checks permissions to make sure the user is allowed to perform the action. And it runs whatever database queries are needed. If the action creates or changes something, the service checks ownership first — only the person who created a post can edit or delete it. If something goes wrong at any step, the service returns one of the standard error types, and the handler turns that into the right status code.

The rule that keeps things clean is simple. Handlers never write SQL. Services never write HTTP responses. This separation means each piece can be tested on its own and changed without affecting the others.

## How the Database Grows Over Time

The database schema changes as the platform gets new features. Every change is recorded in a migration file. A migration is a plain SQL file that describes exactly what to add or change. These files live in a folder under the db section and are numbered in the order they should run.

Every time the server starts, it reads the migration folder. It checks which migrations have already been applied and runs any that have not. The migrations are written with care so that running them twice does not cause problems. If a table already exists, the migration skips creating it. If a column is already present, it skips adding it. This careful design means the server can restart at any time, and the schema will always be up to date without errors.

There are currently four migrations. The first creates the core tables for people, posts, communities, tags, and the relationships between them. The second adds tag voting. The third brings in user lists, affinity scoring, and feed plugins. The fourth adds the system that lets people review moderation decisions publicly.

To add a new migration, you create a new file with the next number in the sequence, write the SQL for what you need to add or change, and restart the server. The server takes care of the rest.

## The Background Workers

Threadlight has a team of workers that run on timers rather than waiting for someone to take an action. They keep the platform running smoothly without anyone having to think about them.

The fastest worker refreshes everyone's feed every thirty seconds so new content appears quickly. Another worker updates trending topics every minute. Every thirty minutes, a worker recomputes algorithmic lists that help people discover new communities and people. Several workers run on an hourly schedule. One computes affinity scores that learn which topics and people a user cares about most. One cleans up old or deleted data to keep the database healthy. One distributes credits to active members based on their participation. One updates the trust distance calculations between users.

Trust scores drift slowly over time, so a worker runs every six hours to apply that decay. Fact-check notes get promoted to more visible positions every five minutes. Achievement checks run every ten minutes to see if anyone has earned something new. Activity statistics update every fifteen minutes to keep the platform aware of how busy things are. And scheduled posts get published every thirty seconds at their appointed time.

Each worker runs in its own space. The scheduler keeps a pool of workers that it manages. If a worker encounters a problem or panics, the scheduler catches the issue and logs it so the other workers can keep going without interruption.

## How Features Are Organized

Every feature in Threadlight follows the same pattern from the database up to the screen. At the bottom is the data layer — the tables and columns in PostgreSQL that store the information the feature needs. Above that is the model layer, which gives that data a shape that Go code can work with. Above the model is the service layer, which contains the business rules and the queries that read and write the data. Above the service is the handler layer, which exposes the feature through the API. And at the top is the front end, which people actually see and interact with.

The dependencies flow in one direction. Services depend on models but know nothing about handlers. Handlers depend on services. The router depends on handlers. No layer reaches above itself. This keeps the code predictable and easy to navigate.

To add something new, you start at the bottom. Decide what data needs to be stored and write a migration. Create or update the model types that represent that data. Add methods to the service that contain the business rules and queries. Create a handler that talks to the service and add its route to the router. Finally, build the front-end components that let people use the new feature.

This layered approach means the code stays organized even as the project grows. Every file has a home. Every home has a clear purpose. And anyone coming to the code for the first time can quickly figure out where to look.
