const { coderunner } = require("../../../src/infra/services/code-runner");
const { LANGUAGE } = require("../../../src/common/language");

const mockCoderunnerContainerUrl = "http://localhost:8080";
const mockCoderunnerFunction = "CodeRunnerFunction";

let mockNodeEnv = "dev";

jest.mock("../../../src/env", () => {
  return {
    env: {
      get CODERUNNER_CONTAINER_URL() {
        return mockCoderunnerContainerUrl;
      },
      get NODE_ENV() {
        return mockNodeEnv;
      },
      get CODERUNNER_FUNCTION() {
        return mockCoderunnerFunction;
      },
    },
  };
});

const mockInvoke = jest.fn();
jest.mock("@aws-sdk/client-lambda", () => {
  return {
    Lambda: function Lambda() {
      return {
        invoke: (args) => mockInvoke(args),
      };
    },
  };
});

describe("CodeRunner", () => {
  it("should be able to hit code runner container endpoint", async () => {
    const result = {
      output: 25,
      input: 5,
    };
    const fetch = jest.spyOn(global, "fetch");
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify(result),
      }),
    });

    const body = {
      language: LANGUAGE.JS,
      code: "async function run(value) {\n  return value * value;\n}",
      inputs: [5],
    };
    const response = await coderunner.run(body);

    expect(fetch).toHaveBeenCalledWith(mockCoderunnerContainerUrl, {
      method: "POST",
      body: JSON.stringify(body),
    });
    expect(response).toEqual(result);
  });

  it("should throw an error if code runner container endpoint fails", async () => {
    const fetch = jest.spyOn(global, "fetch");
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        statusCode: 500,
        error: "Internal Server Error",
      }),
    });

    const body = {
      language: LANGUAGE.JS,
      code: "async function run(value) {\n  return value * value;\n}",
      inputs: [5],
    };
    await expect(async () => coderunner.run(body)).rejects.toThrow(
      new Error("Internal Server Error")
    );

    expect(fetch).toHaveBeenCalledWith(mockCoderunnerContainerUrl, {
      method: "POST",
      body: JSON.stringify(body),
    });
  });

  it("should be able to invoke code runner function", async () => {
    mockNodeEnv = "prod";
    const result = {
      output: 25,
      input: 5,
    };
    mockInvoke.mockResolvedValueOnce({
      Payload: Buffer.from(
        JSON.stringify({
          statusCode: 200,
          body: JSON.stringify(result),
        })
      ),
    });

    const body = {
      language: LANGUAGE.JS,
      code: "async function run(value) {\n  return value * value;\n}",
      inputs: [5],
    };
    const response = await coderunner.run(body);

    expect(mockInvoke).toHaveBeenCalledWith({
      FunctionName: mockCoderunnerFunction,
      Payload: JSON.stringify(body),
    });
    expect(response).toEqual(result);
  });
});
