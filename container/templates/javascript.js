// @code-here

async function executor({ id, value }) {
  const response = {
    id,
    value,
  };

  try {
    const output = await run(value);

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
