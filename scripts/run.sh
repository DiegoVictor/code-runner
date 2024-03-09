#!/bin/sh

TIMESTAMP=$(date +%s)
CONTAINER_TAG="coderunner:$TIMESTAMP"

cd container

docker build --platform linux/amd64 -t $CONTAINER_TAG .

PID=$(docker run --platform linux/amd64 -d -p 9000:8080 $CONTAINER_TAG)

ENDPOINT="http://localhost:9000/2015-03-31/functions/function/invocations"

curl $ENDPOINT -d '{"body":{"language":"js","code":"async function run(value) {\n  return value * value;\n}","inputs":[5]}}'
# curl $ENDPOINT -d '{"body":{"language":"ts","code":"async function run(value: number) {\n  const square: number = value**2;\n  return square;\n}","inputs":[5]}}'
# curl $ENDPOINT -d '{"body":{"language":"python","code":"def run(value):\n  return pow(value, 2)\n","inputs":[5]}}'
# curl $ENDPOINT -d '{"body":{"language":"go","code":"func run(value interface{}) (interface{}, error) {\n  num := float64(value.(float64))\n  return num * num, nil\n}","inputs":[5]}}'
