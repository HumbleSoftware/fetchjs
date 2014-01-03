# Static Client API Example

Start a server with `./server`.  This creates a server on port 3001 which serves
`index.html`.  Then execute `fetch static -p 3002` to serve a client-side
static API.

```sh
./server
fetch static -p 3002
```

Navigate to `http://localhost:3001/`

## index.html

This file includes the static asset served on `http://localhost:3002/` and does
the following:

```javascript
  // The static script exposes a method which returns a request function.
  var request = fetch();
  // Send a request like so:
  request('GET', '/', function (err, res, body) {
    console.log(res);
    console.log(body);
  });
```
