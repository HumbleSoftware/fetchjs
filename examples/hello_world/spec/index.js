describe('/', function () {
  it('GET "Hello World!"', function (done) {
    request
      .get('/', function (req, res) {
        expect(res.text).to.equal('Hello World!');
        done();
      })
  });
});
