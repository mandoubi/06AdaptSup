GreeterTest = TestCase("GreeterTest");

GreeterTest.prototype.testGreet = function() {
  var greeter = new myapp.Greeter();
  assertEquals("Bonjour Jean!", greeter.greet("Jean"));
};