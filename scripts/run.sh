#!/bin/sh

TIMESTAMP=$(date +%s)
CONTAINER_TAG="coderunner:$TIMESTAMP"

cd container

docker build --platform linux/amd64 -t $CONTAINER_TAG .

PID=$(docker run --platform linux/amd64 -d -p 9000:8080 $CONTAINER_TAG)

ENDPOINT="http://localhost:9000/2015-03-31/functions/function/invocations"

curl $ENDPOINT -d '{"language":"js","code":"async function run({ input }) {\n  return input * input;\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":{"input":5}}]}'
# curl $ENDPOINT -d '{"language":"ts","code":"async function run({ input }: Record<string, number>) {\n  const square: number = input**2;\n  return square;\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":{"input":5}}]}'
# curl $ENDPOINT -d '{"language":"python","code":"def run(params):\n  return pow(params['\''input'\''], 2)\n","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":{"input":5}}]}'
# curl $ENDPOINT -d '{"language":"go","code":"func run(params map[string]interface{}) (interface{}, error) {\n  num := float64(params[\"input\"].(float64))\n  return num * num, nil\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":{"input":5}}]}'
