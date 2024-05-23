# Code Runner
[![serverless](https://img.shields.io/badge/serverless-3.38.0-FD5750?style=flat-square&logo=serverless)](https://www.serverless.com/)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![nodemon](https://img.shields.io/badge/nodemon-3.1.0-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/code-runner?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/code-runner)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/code-runner/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

How would you run user's code in a safe way? This application is my answer, code runner runs user's code in a containerized Lambda, preventing access to credentials or any other type of sensitive information. It simulates a challenge platform (HackerRank, Codewars, etc) where users write their solutions and have a service validating it against various test cases.

![Infrastructure Diagram](https://raw.githubusercontent.com/DiegoVictor/code-runner/main/code-runner.drawio.png)

