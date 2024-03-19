#!/bin/sh

AWS_ACCOUNT_ID=
AWS_REGION=us-east-1

CONTAINER_TAG=$(echo "coderunner:$(date +%s)") # current date
AWS_IMAGE_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$CONTAINER_TAG"

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

cd container

docker build --platform linux/amd64 -t $CONTAINER_TAG .
docker tag $CONTAINER_TAG $AWS_IMAGE_URI
docker push $AWS_IMAGE_URI
