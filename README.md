# Code Runner
[![serverless](https://img.shields.io/badge/serverless-3.38.0-FD5750?style=flat-square&logo=serverless)](https://www.serverless.com/)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![nodemon](https://img.shields.io/badge/nodemon-3.1.0-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/code-runner?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/code-runner)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/code-runner/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

How would you run user's code in a safe way? This application is my answer, code runner runs user's code in a containerized Lambda, preventing access to credentials or any other type of sensitive information. It simulates a challenge platform (HackerRank, Codewars, etc) where users write their solutions and have a service validating it against various test cases.

![Infrastructure Diagram](https://raw.githubusercontent.com/DiegoVictor/code-runner/main/code-runner.drawio.png)


# Requirements
* Node.js ^20.9.0
* Serveless Framework
* AWS Account
  * [Elastic Container Registry](https://aws.amazon.com/ecr/)
  * [Lambda](https://aws.amazon.com/lambda)
  * [API Gateway](https://aws.amazon.com/api-gateway/)

# Install
```
npm install
```
Or simple:
```
yarn
```

## Configuring
The application uses just one database: [Postgres](https://www.postgresql.org).

### Postgres
For the fastest setup it is recommended to use [docker-compose](https://docs.docker.com/compose), you just need to run:
```bash
docker-compose up -d pg
```
Or if you prefer to create the container manually:
```bash
docker run --name pg -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

### Migrations
Remember to run the database migrations:
```bash
npx prisma migrate dev
```
> See more information on [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### Code Runner Container
Also, it is necessary to run the code-runner container, this is the one that will execute users' code:
```bash
docker-compose up -d code-runner
```
> Don't forget to update you `.env` file you changed the container settings.

### `.env`
In this file you may configure the database URL, app's port, code-runner container URL and code-runner function name. Rename the `.env.example` in the root directory to `.env` and update your settings as needed.

|key|description|default
|---|---|---
|DATABASE_URL|Database connection Url.|`postgresql://postgres:docker@localhost:5432/code-runner?schema=public`
|PORT|Port number where the app will run.|`5000`
|CODERUNNER_CONTAINER_URL|code-runner container URL. All you'll need to update if you change `docker-compose.yml` is the URL's port.|`http://localhost:9000/2015-03-31/functions/function/invocations`
|CODERUNNER_FUNCTION|code-runner function name, it needs to match with the name on `template.yml`|`CodeRunnerFunction`

# Usage
First of all start up the server:
```
npm run dev:server
```
Or:
```
yarn dev:server
```
> Make sure to have the [`Code Runner Container`](#code-runner-container) and [Postgres](#postgres) running, otherwise you will not be able to execute users' code

## Routes
|route|HTTP Method|params|description
|:---|:---:|:---:|:---:
|`/challenges`|GET| - |Return challenges paginated.
|`/challenges/:id`|GET|`id` of a challenge.|Return challenge's details.
|`/challenges`|POST|Body with challenge `title`, `description`, `instructions` and `inputs`.|Create a new challenge.
|`/challenges/:id/solution`|POST|`id` of a challenge. Body with users' code and language used to solve the problem.|Execute users' code, it uses the results to compare with the expected values provided for the challenge.

### Requests
* `POST /challenges`

Request body:
```json
{
  "title": "Squares",
  "description": "Calculate numbers square",
  "instructions": "For each provided number calculate its square",
  "inputs": [
    {
      "value": 5,
      "expected": 25
    },
    {
      "value": 12,
      "expected": 144
     },
    {
      "value": 25,
      "expected": 625
    }
  ]
}
```

* `POST /challenges/:id/solution`

Request body:
```json
{
  "code": "async function run(value){return value * value;}",
  "language": "js",
}
```


# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
