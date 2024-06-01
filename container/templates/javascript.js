// @code-here

async function executor({ id, value }) {
  const response = {
    id,
    value,
  };

  const stdout = [];
  try {
    const write = process.stdout.write;
    process.stdout.write = (output) => {
      stdout.push(output.replace(/(.+)INFO\s/g, ""));
    };

    const output = await run(value);

    process.stdout.write = write;

    response.output = output;
  } catch (err) {
    response.output = err.message;
  }

  if (stdout.length > 0) {
    response.stdout = stdout.join("");
  }

  return response;
}

module.exports.main = async (inputs) => {
  return Promise.all(inputs.map(executor));
};
