# Threadlight — A Guide for AI Helpers

If you are an AI agent helping to build or improve Threadlight, this page will help you understand how everything fits together.

## The Big Picture

Threadlight is one program that does everything. There is no chain of tiny services talking to each other. A single Go binary serves all the API requests, and a SvelteKit application runs in the browser. Behind them sit a PostgreSQL database that stores everything permanently and a Redis cache that keeps frequently used data close at hand.

The code is organized into several sections. The entry point lives in the cmd folder. That single file reads settings from the environment, connects to the database and Redis, wires all the pieces together, and starts the server. Everything else lives in the internal folder. That is where the real work happens.

The api section handles incoming requests and sends back responses. The services section holds all the business rules and database queries. The model section describes the shapes that data takes as it moves through the system. The db section connects to the database and runs schema changes when the server starts. The search section contains a tool that turns plain-language queries into something the database can understand. The worker section runs tasks on a schedule.

The web folder holds the front end. It has pages for the feed, your profile, communities, search, settings, and more. Everything in the front end talks to the backend through one shared API client.

## How a Request Travels Through the System

When you click a button in Threadlight, the browser sends a message to the server. The server has a router that checks the message path and decides which piece of code should handle it. Before that code runs, the auth middleware checks that you are who you say you are by looking at a token stored in your browser.

Then the handler takes over. It reads whatever you sent — a new post, a search query, a vote on a tag — and passes it to a service. The service is where the thinking happens. It checks that your request makes sense, confirms you are allowed to do what you are asking, and then talks to the database. The database answers, the service passes the result back to the handler, and the handler wraps it up and sends it to your browser.

There is a simple rule. Handlers never talk to the database directly. Services never write responses to the browser. This keeps each piece easy to test and change without breaking anything else.

## What Each Folder Holds

The cmd folder contains the starting point for the whole server. It creates the database connections, builds the scheduler, sets up every handler and every service, and tells the server to start listening for requests.

The api section has two parts. The router lists every web path the server responds to and pairs each one with a handler. The handlers are the thinnest layer of the system. They take data from the incoming request, call a service, turn the result into a response, and send it back. Nothing more.

The services section is the heart of the backend. There are about twenty-five services, each focused on one area. The auth service handles signing up, logging in, and resetting passwords. The post service knows how to create, show, update, and archive posts. The tag service lets people create tags and vote on them. The search service runs powerful searches across posts, users, and communities. The community service manages joining, leaving, forking, and curating communities. The moderation service handles reports, jury selection, and moderation actions. The trust service tracks who trusts whom and how trust changes over time. The credit service manages the economy. The achievement service rewards participation. The notification service sends alerts. The user list service helps people create lists of users to follow or block. The affinity service figures out which people and topics someone cares about most. The feed plugin service runs custom feed programs safely in their own sandbox. And a few more services handle everything else.

Each service holds a connection to the database and takes a context with every method call. This lets the system cancel work that is taking too long or that the user no longer needs.

The model section holds the shapes that describe everything in the system. There are shapes for people, posts, communities, tags, trust connections, replies, notifications, and many more. There are also shapes for data coming in from the browser and shapes for data going back out. All the error types live here too.

The db section connects to PostgreSQL and Redis and runs the migration files every time the server starts. The migrations are plain SQL files that run in order and are written to be safe to run many times.

The search section has one small but powerful tool. It takes a query written in plain language, with words like and, or, and not, and filters like author or community, and turns it into something the database can search against.

The worker section holds the scheduler and all the background workers. These are the helpers that run on timers rather than waiting for someone to click a button.

## How to Add a New Feature

Adding something new follows the same order every time. First, figure out what new data needs to be stored and write a migration to add it. Next, create or update the model shape that describes that data. Then add methods to the right service with the business rules and database queries. After that, create a handler that exposes the new feature through the API and add its path to the router. Finally, build the front-end pieces — the API client functions and the pages that people actually see.

Each step depends on the one before it. If you get stuck, trace back up that chain to find the missing piece.

## The Database in Plain Language

The database stores everything that makes Threadlight work. It holds information about people and their posts, the communities they form, and the tags they use to organize things. It tracks who trusts whom and how those feelings change with time. It records moderation decisions and jury votes and keeps them open for public review. It stores collections of posts, circles of friends, custom lists, and saved searches. It handles the economy with credits, achievements, and bounties. It queues up notifications and remembers settings that control how the platform looks and behaves.

The five most important things in the database are people, posts, communities, tags, and trust. Everything else wraps around those core ideas.

## The Background Workers

While people use Threadlight, a team of helpers works in the background without anyone having to think about them. One refreshes the feed every thirty seconds so new posts appear quickly. Another updates trending topics every minute. Every half hour, a worker recomputes algorithmic lists that help people discover new content. Every hour, several workers do their jobs. One figures out which people and topics someone feels most connected to. Another cleans up old data to keep the database tidy. Another hands out credits to active members. Another updates how trust distances are calculated. Every six hours, trust scores slowly adjust so that old connections do not stay frozen forever. Fact-check notes get promoted every five minutes. Achievement checks run every ten minutes. Activity statistics update every fifteen minutes. And every thirty seconds, any posts that were scheduled for future release get published.

Each worker runs in its own space. If one has a problem, the others carry on without interruption.
