// @code-here

async function executor(input) {
  const response = {
    input,
  };

  try {
    const output = await run(input);

    response.output = output;
  } catch (err) {
    process.stdout.write(err.message);

    response.output = err.message;
  }

  return response;
}

module.exports.main = async (inputs) => {
  return Promise.all(inputs.map(executor));
};
