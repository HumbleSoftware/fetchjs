# Nested Routes example

This example demonstrates how to test nested routes:

```
/resources
/resources/:id
```

In the example, we use the response from `/resources` to make the request for 
the first resource in the list.

```javascript
test.get('/resources', function (error, res) {
  ...

  // Get the id of the first resource from /resources
  var id = res.body[0].id;

  // Request that resource by id
  test.get('/resources/' + id, function (error, res) {
  });
```
