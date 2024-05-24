package main

import (
  "fmt"
  "encoding/json"
  "os"
)

// @code-here

type Request struct {
  Id string `json:"id"`
  Value interface{} `json:"value"`
}

type Response struct {
  Id interface{} `json:"id"`
  Value interface{} `json:"value"`
  Output interface{} `json:"output"`
}

func executor(input Request) Response {
  response := Response{
    Id: input.Id,
    Value: input.Value,
  }

  output, err := run(input.Value)
  if err != nil {
    fmt.Println(err.Error())
    response.Output = err.Error()
    return response
  }

  response.Output = output
  return response
}

func main() {
  var inputs []Request

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
