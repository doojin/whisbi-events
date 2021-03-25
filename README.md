# About the project

So this project basically is a monorepo **(Lerna)** written in Typescript using 
**Express framework** and **Typeorm**.

## Why monorepo?

Original idea was to create two independent of each other packages: 
`REST API service` and a `Web Application` which will be consuming this API. 
`Web application` can theoretically be replaced with any other client 
(like `Mobile Application`, for instance).

## However

I want to be extremely honest here, on some point I realised that this project will be **really** 
time-consuming (I like to dedicate time to carefully design the project architecture, 
cover every peace of logic with unit tests, implement high-level integration tests, etc.)
Since the project itself was time-scoped, I took a decision to sacrifice some functionality in favor
of code and design quality to meet my personal coding standards, 
that is why there will be no `Web Application` implemented. 
Instead, I fully focused on `REST API service` implementation and did my best.

## Project structure

So the project consist of two sub-packages: `@whisbi-events/persistence` and `@whisbi-events/api`.
The first one contains all the classes (entities, repositories, etc) to work with a database,
and the second one contains the endpoints for CRUD operations with events/subscriptions.

## Application design

![Application Design](img/app-design.png?raw=true "Application Design")

This is the design of our REST service.

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

User authentication is happening using access token strategy. Database contains a set of pre-defined users 
(new users with corresponding tokens were supposed to be created via Web Application). In order to authenticate 
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

**Every peace** of project code that contains any sort of logic is covered with unit tests.
For testing, I use `Jest` library.

Beside unit tests, every API endpoint contains a set of integration tests.

You're welcome to check it out: `packages/api/lib/rest/test`. These unit tests cover every rule defined in 
project task + some additional rules added by myself.

I'd like to bring your attention to the implemented integration test mini-framework: 
`packages/api/lib/rest/test/integration.ts`. If you open any integration tests, you'll notice how 
short, readable and understandable they are and how easy it is to add new integration test use cases using 
this small set of helper methods.

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

