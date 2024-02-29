async function run(value) {
  // @code-here
}

async function executor({ input, expected, validator }) {
  const response = {
    input,
    success: false,
    expected,
  };

  try {
    const output = await run(...input);

    response.output = output;
    response.success = validator(output, expected);
  } catch (err) {
    process.stdout.write(err.message);

    response.output = err.message;
  }

  return response;
}

const validator = (output, expected) => output === expected;
const testCases = [
  {
    input: [5],
    expected: 25,
    validator,
  },
  {
    input: [4],
    expected: 16,
    validator,
  },
];

module.exports.main = async () => {
  return Promise.all(testCases.map(executor));
};
