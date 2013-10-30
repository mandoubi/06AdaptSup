(function() {
  var cl;

  cl = require('../../src/cakeLib');

  describe("L'Interface publique", function() {
    it("permet d'accéder et de modifier les modes d'affichage des test", function() {
      var osr, wr;
      osr = cl.oneShotReporter;
      wr = cl.watchReporter;
      osr.should.equal('nyan');
      wr.should.equal('min');
      cl.oneShotReporter = 'progress';
      cl.watchReporter = 'dot';
      cl.oneShotReporter.should.equal('progress');
      cl.watchReporter.should.equal('dot');
      cl.oneShotReporter = osr;
      return cl.watchReporter = wr;
    });
    it("permet d'utiliser la fonction de compilation coffee2js", function(done) {
      var expectedResult, srcSample;
      srcSample = 'dummy = -> 5';
      expectedResult = "(function() {\n  var dummy;\n\n  dummy = function() {\n    return 5;\n  };\n\n}).call(this);\n";
      return cl.coffee2js(srcSample).should.become(expectedResult).notify(done);
    });
    it("permet d'utiliser la fonction de compilation jade2html", function(done) {
      var expectedResult, srcSample;
      srcSample = '!!! 5';
      expectedResult = "<!DOCTYPE html>";
      return cl.jade2html(srcSample).should.become(expectedResult).notify(done);
    });
    return it("permet d'utiliser la fonction de compilation stylus2css", function(done) {
      var expectedResult, srcSample;
      srcSample = "*\n	color red";
      expectedResult = "* {\n  color: #f00;\n}\n";
      return cl.stylus2css(srcSample).should.become(expectedResult).notify(done);
    });
  });

}).call(this);
