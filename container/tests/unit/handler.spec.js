const { transpile } = require("typescript");
const { handler } = require("../../src");
const { LANGUAGE } = require("../../src/common/constants");

const mockMain = jest.fn();
jest.mock("../../src/use-cases/run-js", () => {
  return {
    main: (params) => mockMain(params),
  };
});

describe("Handler", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should be able to call JavaScript runner", async () => {
    const language = LANGUAGE.JS;

    async function run(value) {
      return value * value;
    }

    const output = [{ input: 5, output: 25 }];
    mockMain.mockResolvedValueOnce(output);

    jest.spyOn(console, "log").mockImplementationOnce(() => {});

    const inputs = [{ value: 5 }];
    const response = await handler({
      language,
      code: run.toString(),
      inputs,
    });

    expect(mockMain).toHaveBeenCalledWith({
      inputs,
      code: run.toString(),
    });
    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(output),
    });
  });

  it("should be able to call TypeScript runner", async () => {
    const language = LANGUAGE.TS;

    const code =
      "async function run(value: number): number {\n  return value * value;\n}";

    const output = [{ input: 5, output: 25 }];
    mockMain.mockResolvedValueOnce(output);

    jest.spyOn(console, "log").mockImplementationOnce(() => {});

    const inputs = [{ value: 5 }];
    const response = await handler({
      language,
      code,
      inputs,
    });

    expect(mockMain).toHaveBeenCalledWith({
      inputs,
      code: transpile(code, {
        lib: ["ES2023"],
        module: "node16",
        target: "ES2022",
      }),
    });
    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(output),
    });
  });

  it("should not be able to call a language runner if the language is not supported", async () => {
    const language = "UNSUPPORTED_LANGUAGE";

    async function run(value) {
      return value * value;
    }

    jest.spyOn(console, "log").mockImplementationOnce(() => {});

    const inputs = [{ value: 5 }];
    const response = await handler({
      language,
      code: run.toString(),
      inputs,
    });

    expect(mockMain).not.toHaveBeenCalled();
    expect(response).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: `The provided language not recognized or supported.`,
      }),
    });
  });
});
