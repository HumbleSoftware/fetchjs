# Hello World demo

Start the server with `./server` and execute tests with `./test`.

The server runs on port 3000 by default.  To change this, use the `-p` flag:

```sh
fetch server -p 3001
fetch test http://localhost:3001/
```

## fetch server

`fetch server` starts the server defined in `routes`.  Execute `fetch server -h` for a full set of arguments.

### ./routes

Defines the server.  Here, we have one route `/` which serves "Hello World!".

## fetch test

To run this demo, execute `fetch server -p 3001` to start the server.  `fetch server -h` for a full set of arguments.

### ./spec

Defines the specification to test the API.  This is one test, ensuring a GET to `http://localhost:3001/` returns 'Hello World!'.

