[![Project Build](https://github.com/doojin/whisbi-events/actions/workflows/test-lint.yml/badge.svg)](https://github.com/doojin/whisbi-events/actions/workflows/test-lint.yml)

# Foreword

I need to confess that I spent much more time on this project than I originally planned. The reason for this is my 
desire to show you guys my very best in different areas of software engineering, such as architectural design,
programming (both back-end & front-end), testing, code delivery tools etc. In the end it resulted to the pretty big 
codebase, but I want to ensure you that every peace of this project was crafted very carefully, patiently and with 
attention to details. I hope you will dedicate some of your time to check my work with attention to all details 
as well :)

# About the project

This project is a **Lerna** monorepo written in Typescript (**Express framework** / **React** / **TypeORM**)

## How to run the project?
Project is fully available online, but if for some reason (?) you will want to run it on your local machine:
1. Clone the Github repository
2. Install dependencies: `npm install`
3. Bootstrap Lerna packages: `npm run bootstrap`
4. `Compile` Typescript source code to Javascript: `npm run compile`
5. Project components are independent Docker containers composed together using `docker-compose`. 
   Project is using MySQL database, you have to create `.env` file manually with a couple 
   of variables.:
   ```
   MYSQL_ROOT_PASSWORD=...
   
   MYSQL_DATABASE=...
   
   MYSQL_USER=...
   
   MYSQL_PASSWORD=...
   ```
6. Run: `docker-compose build && docker-compose up`

## Why monorepo?

While designing this project I took a technical decision to decouple REST API from 
web application (in the end, a typical API may have many different 
consumers: a website, SPA, mobile application, etc.) As a 
result, project functionally was split between multiple independent packages.

## Project structure

Project consists of:

- `@whisbi-events/api` - API REST* service
- `@whisbi-events/web` - React SPA - consumer of the API
- `@whisbi-events/notifications` - Notification service (in my opinion) didn't fit into the REST service. 
  For functional & scalability reasons it ended up as an independent package.
- `@whisbi-events/persistence` - contains everything related to the database persistence layer - 
  this functionality shared between `@whisbi-events/api` and `@whisbi-events/notification` packages

(*) **Actually**, service is not following [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) pattern, so I would call it
  RPC-service instead of REST-service, but this is just a formality :)

## Application design

![Application Design](img/app-design.png?raw=true "Application Design")

API service is using token authentication strategy. In order to authenticate a request,
`token` header should be sent. API users and their tokens are stored in the database.

React SPA allows users to log in with their Google accounts. Application 
retrieves user's Google `access_token` and sends to out backend. Backend gets Google Profile 
using given `access_token` and searches existing user in database by profile ID (or creates a new one 
if user not exists yet). Once user is found, backend responds with it's API token to the client 
(token is stored in browser local storage).

This authentication architecture allows us implement different authentication strategies: By Google account,
By Twitter account, By Facebook account, By login/password, etc. But in every scenario API endpoints cannot be accessed 
without retrieving our API tokens.

Before user requests arrive to the `Express` endpoints they pass through API middleware 
(which technically are the Express middleware).
This is where the users are authenticated and where I verify if the request limits 
(per user and per IP address) are exceeded.

After this, requests are passing through the set of custom rules (implemented as Express middleware as well).
Here I check if user has access to different resources, if operation over specific resource is permitted, 
I validate request entities etc.

After this, requests finally reach the Express endpoints which using `@whisbi-events/persistence` 
package interact with a database.

## Authentication

Authentication is happening using API token strategy. 
Database contains a set of users and corresponding tokens. In order to authenticate 
API request, the `token` header is used.

Then a custom middleware tries to find a user with given token in a database. In case if request does not 
contain `token` header, user is considered to be anonymous.

To implement user authentication I used the `passport` library and two strategy libraries: 
`passport-accesstoken` and `passport-anonymous`.

Since user token should not change frequently + database query happens on every API request, I added a 
couple of minutes cache on the repository level to reduce the database stress. The cache is implemented using 
built-in `TypeORM` library capabilities, but in real production application I would use Redis or similar (embedding cache 
on the application level like it's done now makes an application stateful and complicates its horizontal scaling).

You can see the corresponding code here: `packages/api/lib/rest/authentication`

## Rate limiter

I implemented a custom Express middleware which acts as rate limiter for our API.
I decided to use a token bucket (https://en.wikipedia.org/wiki/Token_bucket) algorithm.
Basically, it's an in-memory map collections with user tokens / ip addresses as a key and amount of 
requests received as value. When request is received, we check if any of request limits is exceeded. 
If not, we increment the counter and proceed. Counters are reset once a minute.

Implementation: `packages/api/lib/rest/rules/limitRequestsPerMinute.ts`

Again, instead of using in-memory collections, real production apps should store this data in stores like Redis to
share it between multiple HTTP server instances.

P.S. 

This middleware is configurable with two limit values: `requests per minute per user` and 
`requests per minute per IP address`. Currently, API uses limit of `250` requests per minute per IP address and 
`100` requests per minute per user token.

I'd like to clarify my technical decision.

First, besides limit `per user`, I decided to use limit `per IP address` in order to protect public endpoints
(like list of events) from Denial of Service attacks.

Second, the values. As I said, the value `per IP address` differs from value `per user token`. 
This is because two requests from the same IP address are not necessary requests from the same user.

For example, two different users may share same Wi-Fi network which will result our server to receive requests 
from the same IP address.

In some cases, the whole building/house/office using one network may share the same IP.

In some very rare cases even the whole neighbourhood or small town may share the same IP address :)

That is why we almost always want the `per IP address` limit to be bigger than `per user`.

## Custom rules

Don't have much to say about them. Located here: `packages/api/lib/rest/rules`. 
I tried to make them as small, atomic and reusable as possible.

## Persistence Layer

All the code to work with a database is located here: `packages/persistence`.

It has been a while I wanted to try out `TypeORM` library, so I dedicated some time to learning it and 
trying it out in a real project.

## Endpoints

All application endpoints with corresponding middleware are set up here: `packages/api/lib/rest/index.ts`

The endpoints themselves are stored here: `packages/api/lib/rest/endpoint`

## Notification service

It listens for connections via web sockets. It also queries database every X seconds for events starting in 24h. Then 
it tries to find all active subscriber connections in connection pool for given events. Then it sends notification and 
React application is receiving it and showing the notification.


## Tests

**Every peace** of API code that contains any sort of logic is covered with unit tests.

Beside unit tests, every API endpoint contains a set of integration tests.
Each integration test will launch the whole REST API service, set up real database (MySQL) connection and perform 
HTTP requests to the endpoints using `supertest` library.

You're welcome to check it out: `packages/api/lib/rest/test`. These integration tests cover every rule defined in 
project task + some additional rules added by myself.

I'd like to bring your attention to the implemented integration test mini-framework: 
`packages/api/lib/rest/test/integration.ts`. If you open any integration tests, you'll notice how 
short, readable and understandable they are and how easy it is to add new integration test use cases using 
this small set of helper methods.

I also set up the Github workflow. 
Push to the `main` branch or PR creation triggers the project build.
Build will:
- Fetch the project code and install its dependencies
- Compile the project (translate Typescript code to Javascript)
- Run the Linter 
- Run unit tests
- Set up real MySQL database and run the integration tests on it

## Containerization

Project is split into multiple services running independently: API REST service,
notification service and the web client (React app). In order to run all those together, 
every of these packages is containerized via Docker and then launched using docker-compose.

## Result

You can "play" with application live here: `http://events-whisbi.com/`

If you want to "touch" API directly, you can access it here:  `http://events-whisbi.com:8000/api/v1/.....`. 
In order to access API directly, you need to use a REST client (or plugin for your favourite browser) 
in order to send `token` header.

For example, endpoint for public events: `GET - http://events-whisbi.com:8000/api/v1/event`

The list of available endpoints you can find here: `packages/api/lib/rest/index.ts`.

There is a set of pre-defined users (10) if you don't want to authenticate via web app. 
Each has a token like: `test-token1`, `test-token2`, ..., `test-token10`.

Example of sending/authenticating a request:
![Request Body](img/request-example1.png?raw=true "Request Body")
![Authenticating Request](img/request-example2.png?raw=true "Authenticating Request")

