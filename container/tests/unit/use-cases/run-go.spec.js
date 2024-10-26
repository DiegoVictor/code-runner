const { LANGUAGE } = require("../../../src/common/constants");
const { main } = require("../../../src/use-cases/run-go");

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

const uuid = "6c095a0d-b1da-40cc-aa0b-96580ef29b01";
mockRandomUUID.mockReturnValueOnce(uuid);

jest.mock("node:crypto", () => {
  return {
    randomUUID: () => mockRandomUUID(),
  };
});

const mockCommand = jest.fn();
jest.mock(`../../../src/common/command`, () => {
  return {
    command: (program, args) => mockCommand(program, args),
  };
});

describe("Run Go Use Case", () => {
  it("should be able to run Go code", async () => {
    const template = "// @code-here";
    mockGetTemplateByLanguage.mockResolvedValueOnce(template);

    const inputs = [
      {
        value: 5,
      },
    ];

    const code =
      "func run(value interface{}) (interface{}, error) {\n  num := float64(value.(float64))\n  return num * num, nil\n}";

    const value = inputs[0].value;
    const expected = [{ input: value, output: value ** 2 }];
    mockCommand.mockResolvedValueOnce(JSON.stringify(expected));

    jest.spyOn(console, "log").mockImplementationOnce(() => {});

    const response = await main({ code, inputs });

    expect(mockGetTemplateByLanguage).toHaveBeenCalledWith({
      language: LANGUAGE.GO,
    });

    const fileName = `/tmp/${uuid}.go`;
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringMatching(fileName),
      code
    );
    expect(mockCommand).toHaveBeenCalledWith("go", [
      "run",
      fileName,
      JSON.stringify(inputs),
    ]);
    expect(response).toStrictEqual(expected);
  });
});
