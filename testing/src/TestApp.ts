var TestRunner = new Blend.testing.TestRunnerSingleton();
Blend.Environment.ready(function() {
	TestRunner.run();
});
Blend.Environment.kickStart();