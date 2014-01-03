test.get('/resources', function (error, res) {

  it('returns status 200', function () {
    expect(res.status).to.equal(200);
  });

  it('returns an array', function () {
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length.gt(0);
  });

  it('does an async test', function (done) {
    done();
  });

  // Get the id of the first resource from /resources
  var id = res.body[0].id;

  // Request that resource by id
  test.get('/resources/' + id, function (error, res) {
    it('returns status 200', function () {
      expect(res.status).to.equal(200);
    });
    it('returns an array', function () {
      expect(res.body).to.be.an('object');
    });
    it('resturns resource with id ' + id, function () {
      expect(res.body.id).to.equal(id);
    });
  });

  test.get('/resources/0', function (error, res) {
    it('returns status 404', function () {
      expect(res.status).to.equal(404);
    });
  });
});
