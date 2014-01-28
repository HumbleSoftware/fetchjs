# Static Client Build Example

Start a server with `./server`.  This creates a server on port 3001 which serves
`index.html`.  Then execute `fetch build` to build static client-side JS and 
output to the file `static-build.js`.  Use `fetch build -o <path>` to change the
build location.

```sh
./server
fetch build
```

Navigate to `http://localhost:3001/`

## index.html

This file includes `static-build.js` and does the following:

```javascript
  // The static script exposes a method which returns a request function.
  var request = fetch();
  // Send a request like so:
  request('GET', '/', function (err, res, body) {
    console.log(res);
    console.log(body);
  });
```
