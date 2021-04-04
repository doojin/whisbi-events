[![Project Build](https://github.com/doojin/whisbi-events/actions/workflows/test-lint.yml/badge.svg)](https://github.com/doojin/whisbi-events/actions/workflows/test-lint.yml)

# About the project

So this project basically is a monorepo **(Lerna)** written in Typescript using 
**Express framework** and **Typeorm**.

## How to run the project?
1. You clone the project to your machine
2. You install project dependencies: `npm install`
3. You bootstrap Lerna packages: `npm run bootstrap`
4. You `compile` Typescript source code to Javascript output: `npm run compile`
5. All application components will be running via Docker using `docker-compose`. 
   Application is using MySQL database, so you need to manually create .env file with a couple 
   of variables.:
   
   MYSQL_ROOT_PASSWORD=...
   
   MYSQL_DATABASE=...
   
   MYSQL_USER=...
   
   MYSQL_PASSWORD=...
6. You run: `docker-compose build && docker-compose up`

## Why monorepo?

During the architecture design I took a technical decision to decouple the REST API itself from 
the web application that is consuming it (in the end, a typical API may have many different 
clients: classical multi-page web application, SPA, mobile application, etc., right?) As a 
result, project functionality was split between multiple packages.

## Project structure

Project consists of:

- `@whisbi-events/api` is an API REST* service
- `@whisbi-events/web` is a React single page application - consumer of the API
- `@whisbi-events/notifications` as a final result, web-socket notification service became a separate package 
  (since it's functionality is not related to the REST API)
- `@whisbi-events/persistence` package contains all the code related to the database persistence - 
  functionality shared between `@whisbi-events/api` and `@whisbi-events/notification` packages

(*) **Actually**, service is not following [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) pattern, so I would call it
  RPC-service instead of REST-service, but this is just a formality :)

## Application design

![Application Design](img/app-design.png?raw=true "Application Design")

This is the design of our REST service.

API service is protected with tokens stored in a database. In order to authenticate an API request, 
you need to send a `token` header with your token value.

Now. React application allows users to authenticate via Google Profile API. React application 
retrieves user's Google `access_token` and sends it to our API backend. Our API retrieves Google Profile 
using given `access_token` and creates a new user (and API `token`) if user with given Google ID not exists yet.

Using this authentication architecture our API is independent to different authentication strategies 
(in the end, to access the API, one way or another the token from our database is needed). 
Same way we can add authentication via Facebook API, Twitter API etc.

Before user requests arrive to the `Express` endpoints they pass through API middleware 
(implemented as Express middleware).
This is where the users are authenticated and where happens the verification if the request limits 
per user and per IP address are exceeded.

After this, requests are passing through the set of custom rules (implemented as Express middleware as well).
Here we check if user has access to different resources, if operation over specific resource is permitted, 
we validate request entities etc.

After this, requests finally reach the Express endpoints which using `@whisbi-events/persistence` 
package interact with a database.

## Authentication

As I said, authentication is happening using token strategy. 
Database contains a set of users and corresponding tokens. In order to authenticate 
API request, the `token` header is used.

Then a custom middleware tries to find a user with given token in a database. In case if request does not 
contain `token` header, user is considered to be anonymous.

To implement user authentication I used the `passport` library and two strategy libraries: 
`passport-accesstoken` and `passport-anonymous`.

Since user token should not change frequently + database query happens on every API request, I added a 
couple of minutes cache on the repository level to reduce the database stress. The cache is implemented using 
built-in `Typeorm` capabilities, but in real production application I would use Redis or similar (embedding cache 
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

I'd like to to clarify my technical decision.

First, besides limit `per user`, I decided to use limit `per IP address` in order to protect public endpoints
(like list of events) from Denial of Service attacks.

Second, about the values. As you can see, the value `per IP address` differs from value `per user token`. Basically, 
this is because two requests from the same IP address are not necessary requests from the same user.

For example, two different users may share same Wi-Fi network which will result our server to receive requests 
from the same IP address.

In some cases, the whole building/house/office using one network may share the same IP.

In some very rare cases even the whole neighbourhood or small town itself may share the same IP address :)

That is why we almost always want the `per IP address` limit to be bigger than `per user`.

## Custom rules

Don't have much to say about them. Located here: `packages/api/lib/rest/rules`. 
I tried to make them as small, atomic and reusable as possible.

## Persistence Layer

All the code to work with a database is located here: `packages/persistence`.

It has been a while I wanted to try out `Typeorm` library, so I dedicated some time to learning it and 
trying it out in a real project.

## Endpoints

All application endpoints with corresponding middleware are set up here: `packages/api/lib/rest/index.ts`

The endpoints themselves are stored here: `packages/api/lib/rest/endpoint`


## Tests

**Every peace** of API code that contains any sort of logic is covered with unit tests.
For testing, I use `Jest` library.

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

As I said, project is split into multiple services running independently: API REST service,
notification service and the web client (React app). In order to run all those together, 
every of these package is containerized and then launched using docker-compose.

## Result

You can "touch" the API live here:  `http://94.176.233.132:8000/api/v1`. In order to do it, you need to use some REST 
client (or plugin for your favourite browser).

For example, endpoint for public events: `GET - http://94.176.233.132:8000/api/v1/event`

The list of available endpoints you can find here: `packages/api/lib/rest/index.ts`.

Endpoints which are supposed to be used by authenticated users should contain the "token" header.

There is a set of pre-defined users (10). Each has a token like: `test-token1`, `test-token2`, ..., `test-token10`.

Example of sending/authenticating a request:
![Request Body](img/request-example1.png?raw=true "Request Body")
![Authenticating Request](img/request-example2.png?raw=true "Authenticating Request")

