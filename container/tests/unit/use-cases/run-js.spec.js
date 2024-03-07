const { LANGUAGE } = require("../../../src/common/constants");
const { main } = require("../../../src/use-cases/run-js");

const mockGetTemplateByLanguage = jest.fn();
jest.mock("../../../src/common/file", () => {
  return {
    getTemplateByLanguage: (params) => mockGetTemplateByLanguage(params),
  };
});

const mockWriteFile = jest.fn();
jest.mock("node:fs/promises", () => {
  return {
    writeFile: (filename, content) => mockWriteFile(filename, content),
  };
});

const mockRandomUUID = jest.fn();
jest.mock("node:crypto", () => {
  return {
    randomUUID: () => mockRandomUUID(),
  };
});

const uuid = "6c095a0d-b1da-40cc-aa0b-96580ef29b01";
mockRandomUUID.mockReturnValueOnce(uuid);
const mockMain = jest.fn();
jest.mock(
  `/tmp/6c095a0d-b1da-40cc-aa0b-96580ef29b01.js`,
  () => {
    return {
      main: (inputs) => mockMain(inputs),
    };
  },
  { virtual: true }
);

describe("Run JS Use Case", () => {
  it("should be able to run JS code", async () => {
    const template = "// @code-here";
    mockGetTemplateByLanguage.mockResolvedValueOnce(template);

    const inputs = [
      {
        value: 5,
      },
    ];

    function run(value) {
      return value * value;
    }
    const code = run.toString();

    const value = inputs[0].value;
    mockMain.mockResolvedValueOnce([{ input: value, output: run(value) }]);

    const response = await main({ code, inputs });

    expect(mockGetTemplateByLanguage).toHaveBeenCalledWith({
      language: LANGUAGE.JS,
    });
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringMatching(`/tmp/${uuid}.js`),
      code
    );
    expect(response);
  });
});
