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

  it("should be able to call the correct language runner", async () => {
    const language = LANGUAGE.JS;

    async function run(value) {
      return value * value;
    }

    const output = [{ input: 5, output: 25 }];
    mockMain.mockResolvedValueOnce(output);

    const inputs = [{ value: 5 }];
    const response = await handler({
      body: {
        language,
        code: run.toString(),
        inputs,
      },
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

  it("should not be able to call a language runner if the language is not supported", async () => {
    const language = "UNSUPPORTED_LANGUAGE";

    async function run(value) {
      return value * value;
    }

    const inputs = [{ value: 5 }];
    const response = await handler({
      body: {
        language,
        code: run.toString(),
        inputs,
      },
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
