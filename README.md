# Code Runner
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DiegoVictor/code-runner/deploy.yml?logo=github&style=flat-square)](https://github.com/DiegoVictor/code-runner/actions)
[![postgres](https://img.shields.io/badge/postgres-326690?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![prisma](https://img.shields.io/static/v1?label=prisma&message=6.4.1&color=2d3748&logo=prisma&style=flat-square)](https://www.prisma.io)
[![serverless](https://img.shields.io/badge/serverless-4.7.0-FD5750?style=flat-square&logo=serverless)](https://www.serverless.com/)
[![typescript](https://img.shields.io/badge/typescript-5.7.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![nodemon](https://img.shields.io/badge/nodemon-3.1.9-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/code-runner?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/code-runner)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/code-runner/refs/heads/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

How would you run user's code in a safe way? This application is my answer, Code Runner runs user's code in a containerized Lambda, preventing access to credentials or any other type of sensitive information. It simulates a challenge platform (HackerRank, Codewars, etc) where users write their solutions and have a service running, comparing the output and validating the results.

![Infrastructure Diagram](https://raw.githubusercontent.com/DiegoVictor/code-runner/main/code-runner.drawio.png)

## Table of Contents
* [Requirements](#requirements)
* [Install](#install)
  * [Configuring](#configuring)
    * [`.env`](#env)
    * [Postgres](#postgres)
    * [Migrations](#migrations)
    * [Code Runner Container](#code-runner-container)
* [Usage](#usage)
  * [Routes](#routes)
    * [Requests](#requests)
* [Deploy](#deploy)
  * [`ops.yml`](#opsyml)
  * [`infrastructure.yml`](#infrastructureyml)
  * [Push Image to ECR Repository](#push-image-to-ecr-repository)
  * [`template.yml`](#templateyml)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Requirements
* Node.js ^20.9.0
* Serveless Framework
* AWS Account
  * [Elastic Container Registry](https://aws.amazon.com/ecr)
  * [Lambda](https://aws.amazon.com/lambda)
  * [API Gateway](https://aws.amazon.com/api-gateway)
  * [RDS](https://aws.amazon.com/pt/rds)
  * [Secrets Manager](https://aws.amazon.com/pt/secrets-manager)
  * [S3](https://aws.amazon.com/pt/s3)
  * [EC2](https://aws.amazon.com/pt/ec2)

# Install
```
npm install
```
Or simply:
```
yarn
```

## Configuring
The application uses just one database: [Postgres](https://www.postgresql.org).

### `.env`
In this file you may configure the database URL, app's port, code-runner container URL and code-runner function name. Rename the `.env.example` in the root directory to `.env` and update your settings as needed.

|key|description|default
|---|---|---
|DATABASE_URL|Database connection Url.|`postgresql://postgres:docker@localhost:5432/code-runner?schema=public`
|PORT|Port number where the app will run.|`5000`
|CODERUNNER_CONTAINER_URL|code-runner container URL. All you'll need to update if you change `docker-compose.yml` is the URL's port.|`http://localhost:9000/2015-03-31/functions/function/invocations`
|CODERUNNER_FUNCTION|code-runner function name, it needs to match with the name on `template.yml`|`CodeRunnerFunction`

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
  "title": "Square It Up!",
  "description": "Create a function that takes a single integer and returns its square. This challenge will test your ability to perform basic math operations and return statements.",
  "instructions": "1. Input: You'll receive a single integer as input.\n2. Output: Return the square of the input integer (the integer multiplied by itself).\n 3. Example: If the input is 5, the output should be 25.\n\nGive it a try and square it up!",
  "languages": [
    "js",
    "ts",
    "python",
    "go"
  ],
  "inputs": [
    {
      "id": "clwm7ealm000008ky9raxasvv",
      "value": {
          "input": 5
      },
      "expected": 25
    },
    {
      "id": "clwm7eoyf000108ky2gmpa65o",
      "value": {
          "input": 12
      },
      "expected": 144
     },
    {
      "id": "clwm7f482000308kyg437fhmq",
      "value": {
          "input": 25
      },
      "expected": 625
    }
  ]
}
```

* `POST /challenges/:id/solution`

Request body:
```json
{
  "code": "function run(value){\n  return value * value;\n}",
  "language": "js",
}
```

# Deploy
Deploy the application in the following order:

  1. [`ops.yml`](#opsyml) (Optional)
  2. [`infrastructure.yml`](#infrastructureyml)
  3. [Push Image to ECR Repository](#push-image-to-ecr-repository)
  4. [`template.yml`](#templateyml)

### `ops.yml`
Only deployable manually, this is responsible for create permissions needed by github actions, that is, you don't need to deploy this stack if you are not using the pipeline.
```shell
sam deploy --stack-name coderunner-ops \
  --template ops.yml \
  --no-fail-on-empty-changeset
```

### `infrastructure.yml`
   (Required) - Responsible for create an ECR Repository and RDS Database Instance and its credentials.
  ```shell
  sam deploy --stack-name coderunner-infrastructure \
    --template infrastructure.yml \
    --no-fail-on-empty-changeset
  ```

### Push Image to ECR Repository
Push container image to ECR Repository created in the previous step:
  1. Log in into ECR:
  ```bash
  aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com
  ```

  2. Build the image:
  ```bash
  cd container
  docker build --platform linux/amd64 -t coderunner:1.0.0 .
  ```

  3. Tag
  ```bash
  docker tag coderunner:1.0.0 <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/coderunner:1.0.0
  ```

  4. And push to ECR Repository
  ```bash
  docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/coderunner:1.0.0
  ```

### `template.yml`
Deploy application:
```bash
sam deploy --stack-name coderunner-dev \
  --no-fail-on-empty-changeset \
  --image-repositories CodeRunnerFunction=<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/coderunner \
  --capabilities CAPABILITY_IAM \
  --role-arn <CLOUDFORMATION_ROLE_ARN> \
  --parameter-overrides \
  ImageUri=<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/coderunner:1.0.0
```
> You can get `CLOUDFORMATION_ROLE_ARN` from `ops.yml` if you deployed it, otherwise you will need to create it manually.

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
