const { LANGUAGE } = require("../../../src/application/language");
const { challengeSolution } = require("../../../src/use-cases/solution");

const mockRun = jest.fn();
jest.mock("../../../src/infra/services/code-runner", () => {
  return {
    coderunner: {
      run: (args) => mockRun(args),
    },
  };
});

describe("Solution", () => {
  it("should be able to return results", async () => {
    const inputs = [
      { id: 1, value: 5, expected: 25 },
      { id: 2, value: 10, expected: 100 },
      { id: 3, value: 15, expected: 225 },
    ];
    const code = "async function run(value) {\n  return value * value;\n}";

    mockRun.mockResolvedValue(
      inputs.map(({ id, value, expected }) => ({
        id,
        input: value,
        output: expected,
      }))
    );

    const response = await challengeSolution.run({
      inputs,
      language: LANGUAGE.js,
      code,
    });

    expect(mockRun).toHaveBeenCalledWith({
      inputs: inputs.map(({ id, value }) => ({ id, value })),
      language: LANGUAGE.js,
      code,
    });
    expect(response).toEqual(
      inputs.map(({ value, expected }, index) => {
        const response = {
          input: value,
          output: expected,
          pass: true,
          expected,
        };

        if (index >= 2) {
          delete response.expected;
        }

        return response;
      })
    );
  });
});
