import json
import sys
from io import StringIO

# @code-here

def executor(input):
  id, value = input.values()
  response = {
    'id': id,
    'value': value,
  }

  try:
    original_stdout = sys.stdout
    sys.stdout = StringIO()

    output = run(value)

    response['stdout'] = sys.stdout.getvalue().replace("\n", "\\n")

    sys.stdout = original_stdout

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
