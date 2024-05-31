# Code Runner Container
Runs inputed code in an isolated container.

# Install
```
npm install
```
Or simple:
```
yarn
```

# Usage
Before build the image is necessary to do a small tweak on `Dockerfile` for local testing. Uncomment lines from 52 to 54 and commnet lines 57 and 58:
```dockerfile
# Running locally
COPY aws-lambda-rie /aws-lambda
ENTRYPOINT ["/aws-lambda/aws-lambda-rie"]
CMD ["/usr/local/bin/npx", "aws-lambda-ric", "src/index.handler"]

# Running on AWS
# ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
# CMD ["src/index.handler"]
```

## Downloading aws-lambda-rie
Now download and unziped `aws-lambda-rie` inside `container` folder. Check `(Optional) Test the image locally` section from [Using an alternative base image with the runtime interface client](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-image.html#nodejs-image-clients).

At this point, your folder structure should look like this:
```
/container
  /aws-lambda-rie
    aws-lambda-rie
  /node_modules
  ...
```

## Building and Running
Now, you're ready to build the image:
```bash
TIMESTAMP=$(date +%s)
CONTAINER_TAG="coderunner:$TIMESTAMP"

docker build --platform linux/amd64 -t $CONTAINER_TAG .
```

and run the container:
```bash
docker run --platform linux/amd64 -d -p 9000:8080 $CONTAINER_TAG
```

## Executing
Once you have the container ready you can send and run code like this:

```bash
ENDPOINT="http://localhost:9000/2015-03-31/functions/function/invocations"

curl $ENDPOINT -d '{"language":"js","code":"async function run(value) {\n  return value * value;\n}","inputs":[{"id":"clwihx1hx000008l83dl877wj","value":5}]}'
```

Output:
```json
{"statusCode":200,"body":"[{\"id\":\"clwihx1hx000008l83dl877wj\",\"value\":5,\"output\":25}]"}
```
> Understand, the container will only execute the code and return the results. If that is correct or not isn't the container responsability.
