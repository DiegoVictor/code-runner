#!/bin/sh

sam deploy --stack-name coderunner-infrastructure \
  --template infrastructure.yml \
  --no-fail-on-empty-changeset
