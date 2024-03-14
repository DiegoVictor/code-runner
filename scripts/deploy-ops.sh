#!/bin/sh

sam deploy --stack-name coderunner-ops \
  --template ops.yml \
  --no-fail-on-empty-changeset
