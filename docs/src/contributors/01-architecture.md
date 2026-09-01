# Architecture Overview

This page explains how Threadlight is built, for developers who want to understand or contribute to the code.

## High-Level Structure

Threadlight has three main parts, each living in its own corner of the project. The server itself lives in the cmd folder and is the thing you run when you start Threadlight. It is the entry point that wires everything together. The internal folder holds all the Go backend code — this is the brain of the application, where requests are handled, business logic lives, and background tasks get done. The web folder holds the frontend, a friendly user interface built with Svelte that runs right in your browser. When someone visits Threadlight, the frontend talks to the backend, and the backend takes care of the rest.

## Backend (Go)

The backend is written in Go and uses a few trusted libraries to get its work done. Gin handles routing, which means it directs each incoming request to the right place. Pgx connects to PostgreSQL, the database that stores all the data. Go-redis connects to Redis, a fast memory store used for temporary data like sessions and caches. Zerolog handles logging, so developers can see what the server is doing and notice when something goes wrong.

When a request comes in, it travels through the server in a clear path. It arrives at the main entry point in the cmd folder, where the server starts up, reads its environment settings, and gets everything ready. From there the request moves to the router, which looks at the request's address and decides which handler should deal with it. The handler is a function that understands what the request wants, and it calls on a service to do the real work. Services contain the business logic — the rules and decisions that make Threadlight work the way it does. Services talk directly to the database using pgx, fetching or saving whatever data is needed. Once the work is done, the response travels back through the handler and out to whoever made the request.

Several key files bring this together. The main server file in cmd sets up everything at startup: it reads environment variables, connects to the database, and starts the web server. The router file in the internal api folder maps every possible request address to its handler, and also sets up middleware — little helpers that run on every request, like checking that someone is logged in. The handler files live in their own folder inside the api directory, one per type of resource, like posts or users or communities. The service files live in their own folder too, and each one contains the rules for a specific part of the application. Database migrations live in the db folder as SQL files — these are scripts that change the database structure over time as the project grows. And the worker files in the worker folder handle background tasks that run periodically, like cleaning up old content.

## Frontend (Svelte)

The frontend is a single-page application, which means once it loads in your browser, it handles navigation on its own without reloading the whole page. It is built with Svelte, a tool that makes it fun and fast to build user interfaces, and Vite, which helps with building and updating the code while you develop it. Routing — deciding which page to show based on the address in the browser — is handled on the client side by a library called svelte-spa-router. The application's state, like who is logged in and what posts are visible, is managed with Svelte stores, which are special containers that remember information and tell the page to update when that information changes. Every time the frontend needs data from the server, it makes an API call directly to the Go backend using a small client module that knows how to talk to the server properly.

The main frontend file is App.svelte, which sets up the router and ties everything together. Reusable components that appear in many places — like a post card or a user avatar — live in the lib folder. Each page of the application, like the home feed or a community page, has its own file in the routes folder. And the API client that connects the frontend to the backend lives in the lib folder as a small JavaScript module, so every page can use it without repeating the same code.

## Database

Threadlight uses PostgreSQL to store everything that makes the community run. The database has several main tables, each responsible for a different kind of data. The users table holds accounts, profiles, and trust scores that help the system know who is who and how community members relate to each other. The posts table stores all the posts that people write and everything inside them. The communities table keeps track of groups that people can join and participate in. The community_notes table holds fact-checks and helpful context added to posts by the community itself. The trust_connections table records who trusts whom, which is how the system learns about relationships between members. And the tags table stores hashtags and topic labels that help organize content.

Whenever the database needs to change — for example, when a new feature requires a new table or a new column — a migration script is added to the migrations folder. These scripts run automatically every time the server starts, so the database is always up to date without anyone having to remember to run them by hand.

## Background Workers

Behind the scenes, Threadlight runs background workers that take care of periodic tasks so nobody has to do them manually. The most important one is content pruning, which runs once every hour and removes old or low-quality posts to keep the database tidy and the feed fresh. More workers can be added easily in the scheduler file inside the worker folder, and the pattern is simple enough that anyone familiar with Go can add a new task without much trouble.

## Data Flow Example: Creating a Post

To see how all these pieces work together, imagine someone writing a post and clicking the post button. In the browser, the frontend catches the click and sends a request to the server with the post's content. The router receives this request and directs it to the create post handler. The handler checks that the input is valid — making sure there is actually some text and that the user is allowed to post — and then calls the create post service to do the real work. The service inserts the new post into the database, giving it an id, a timestamp, and all the information it needs. Once the database confirms the save, the service hands the new post back to the handler, which wraps it up as a JSON response and sends it back to the frontend. The frontend receives the response, updates the feed to show the new post right away, and the person who wrote it sees their post appear instantly.
