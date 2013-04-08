# Hello World demo

Start the server with `./server` and execute tests with `./test`.

The server runs on port 3000 by default.  To change this, use the `-p` flag:

```sh
./server -p 3001
./test http://localhost:3001/
```

## `./server`

`./server` starts the server defined in `routes`.  Execute `./server --help` for a full set of arguments.

## `./test`

To run this demo, execute `./server` to start the server.  `./server --help` for a full set of arguments.

## `routes`

Defines the server.  Here, we have one route `/` which serves "Hello World!".

## `spec`

Defines the specification to test the API.  This is one test, ensuring a GET to `http://localhost:3000/` returns 'Hello World!'.

