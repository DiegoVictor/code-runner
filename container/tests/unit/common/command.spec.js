const { command } = require("../../../src/common/command");

const mockSpawn = jest.fn();
jest.mock("node:child_process", () => {
  return {
    spawn: (cmd, args) => mockSpawn(cmd, args),
  };
});

describe("Command", () => {
  it("should be able to run a command", async () => {
    const data = { success: true };
    mockSpawn.mockReturnValueOnce({
      stdout: {
        on: (eventName, func) => {
          switch (eventName) {
            case "data":
              func(Buffer.from(JSON.stringify(data)));
              break;

            case "close":
              func();
              break;
          }
        },
      },
    });

    const cmd = "echo";
    const args = ["Hellow World"];

    const response = await command(cmd, args);

    expect(mockSpawn).toHaveBeenCalledWith(cmd, args);
    expect(response).toBe(JSON.stringify(data));
  });
});
