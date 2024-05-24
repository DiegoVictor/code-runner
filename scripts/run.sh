#!/bin/sh

TIMESTAMP=$(date +%s)
CONTAINER_TAG="coderunner:$TIMESTAMP"

cd container

docker build --platform linux/amd64 -t $CONTAINER_TAG .

PID=$(docker run --platform linux/amd64 -d -p 9000:8080 $CONTAINER_TAG)

ENDPOINT="http://localhost:9000/2015-03-31/functions/function/invocations"

curl $ENDPOINT -d '{"language":"js","code":"async function run(value) {\n  return value * value;\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":5}]}'
# curl $ENDPOINT -d '{"language":"ts","code":"async function run(value: number) {\n  const square: number = value**2;\n  return square;\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":5}]}'
# curl $ENDPOINT -d '{"language":"python","code":"def run(value):\n  return pow(value, 2)\n","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":5}]}'
# curl $ENDPOINT -d '{"language":"go","code":"func run(value interface{}) (interface{}, error) {\n  num := float64(value.(float64))\n  return num * num, nil\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":5}]}'
