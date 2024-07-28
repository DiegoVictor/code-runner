package main

import (
  "fmt"
  "encoding/json"
  "os"
  "bytes"
  "io"
)

// @code-here

type Request struct {
  Id string `json:"id"`
  Value map[string]interface{} `json:"value"`
}

type Response struct {
  Id interface{} `json:"id"`
  Value interface{} `json:"value"`
  Output interface{} `json:"output"`
  Stdout string `json:"stdout"`
}

func executor(input Request) Response {
  response := Response{
    Id: input.Id,
    Value: input.Value,
  }

  originalStdout := os.Stdout
	reader, writer, _ := os.Pipe()
	os.Stdout = writer

	channel := make(chan string)

	go func() {
		var buffer bytes.Buffer
		io.Copy(&buffer, reader)
		channel <- buffer.String()
	}()

  output, err := run(input.Value)

  writer.Close()
	os.Stdout = originalStdout

  response.Stdout = <-channel

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
