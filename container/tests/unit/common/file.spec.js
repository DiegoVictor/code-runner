const { LANGUAGE, EXTENSION } = require("../../../src/common/constants");
const { getTemplateByLanguage } = require("../../../src/common/file");

const mockReadFile = jest.fn();
jest.mock("node:fs/promises", () => {
  return {
    readFile: (path) => mockReadFile(path),
  };
});

describe("File", () => {
  it("should be able to get a template by language", async () => {
    const content = "File content";
    mockReadFile.mockResolvedValueOnce({
      toString: () => content,
    });

    const language = LANGUAGE.JS;
    const response = await getTemplateByLanguage({ language });

    expect(mockReadFile).toHaveBeenCalledWith(
      `./templates/${language.toLowerCase()}.${EXTENSION[language]}`
    );
    expect(response).toBe(content);
  });
});
