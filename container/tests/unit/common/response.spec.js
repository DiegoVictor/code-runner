const { HTTP } = require("../../../src/common/response");

describe("Response HTTP", () => {
  it("should be able to return HTTP Status Code 200", () => {
    const response = {
      foo: "bar",
    };
    expect(HTTP.OK(response)).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify(response),
    });
  });

  it("should be able to return HTTP Status Code 400", () => {
    const response = {
      foo: "bar",
    };
    expect(HTTP.BAD_REQUEST(response)).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify(response),
    });
  });
});
