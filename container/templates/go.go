package main

import (
  "fmt"
  "encoding/json"
  "os"
)

// @code-here

type Response struct {
  Input interface{} `json:"input"`
  Output interface{} `json:"output"`
}

func executor(input interface{}) Response {
  response := Response{
    Input: input,
  }

  output, err := run(input)
  if err != nil {
    fmt.Println(err.Error())
    response.Output = err.Error()
    return response
  }

  response.Output = output
  return response
}

func main() {
  var inputs []interface{}

  err := json.Unmarshal([]byte(os.Args[1]), &inputs)
  if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

  responses := make([]Response, 0)
  for _, input := range inputs {
    responses = append(responses, executor(input))
  }

  result, err := json.Marshal(responses)
  if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

  fmt.Println(string(result))
}
