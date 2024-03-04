#!/bin/sh

sam deploy --stack-name code-runner-infrastructure \
  --template infrastructure.yml \
  --no-fail-on-empty-changeset