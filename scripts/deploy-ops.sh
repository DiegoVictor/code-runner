#!/bin/sh

sam deploy --stack-name code-runner-ops \
  --template ops.yml \
  --no-fail-on-empty-changeset
