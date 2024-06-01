ARG FUNCTION_DIR="/function"



# Build application
FROM node:20-buster as app-build
ARG FUNCTION_DIR

RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

RUN mkdir -p ${FUNCTION_DIR}
WORKDIR ${FUNCTION_DIR}

COPY templates templates
COPY src src
COPY package.json .

RUN npm install
RUN npm install aws-lambda-ric



# Install Go
FROM node:20-buster as go-build
RUN apt-get update && apt-get install -y curl && \
    curl -OL https://go.dev/dl/go1.22.0.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz



# Final image
FROM node:20-buster-slim
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_DISABLE_COLORS=1
ARG FUNCTION_DIR

COPY --from=go-build /usr/local/go /usr/local/go
RUN ln -s /usr/local/go/bin/go /usr/local/bin/go

RUN apt-get update && apt-get install -y python3
RUN ln -s /usr/bin/python3.7 /usr/local/bin/python

WORKDIR ${FUNCTION_DIR}
COPY --from=app-build ${FUNCTION_DIR} ${FUNCTION_DIR}

# Running locally
# COPY aws-lambda-rie /aws-lambda
# ENTRYPOINT ["/aws-lambda/aws-lambda-rie"]
# CMD ["/usr/local/bin/npx", "aws-lambda-ric", "src/index.handler"]

# Running on AWS
ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["src/index.handler"]
