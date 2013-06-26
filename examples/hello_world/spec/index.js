describe('/', function () {
  it('GET "Hello World!"', function (done) {
    request
      .get('/', function (req, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Hello World!');
        done();
      })
  });
});
