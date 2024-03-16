import json
import sys

# @code-here

def executor(input):
  response = {
    'input': input,
  }

  try:
    output = run(input)

    response['output'] = output
  except Exception as err:
    response['output'] = err;

  return response

result = []
inputs = json.loads(sys.argv[1])

for input in inputs:
  result.append(executor(input))

output_json = json.dumps(result)
print(output_json)

sys.stdout.flush()
