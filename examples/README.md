# Examples

These examples each include mock APIs as well as specifications for those APIs.
The API is started using the `fetch server` command, in each example.  To
execute the tests, use the `fetch test` command.

The server runs on port 3000 by default.  To change this, use the `-p` flag:

```sh
fetch server -p 3001
fetch test http://localhost:3001/
```

## fetch server

This command starts a server serving the `routes/` folder of the current working
directory.  See `fetch server -h` for a full set of arguments.

## fetch test

This command executes tests from the `spec/` folder of the current working
directory.  See `fetch test -h` for a full set of arguments.
