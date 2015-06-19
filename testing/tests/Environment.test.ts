///<reference path="../../src/testing/TestRunner.ts"/>
///<reference path="../src/TestApp.ts"/>
///<reference path="../../src/Blend.ts"/>
///<reference path="../../src/Environment.ts"/>

TestRunner.defineTest('Core', 'Environment', function(t: Blend.testing.TestRunnerSingleton) {
	t.isOk(Blend.Environment);

	//ready
	var ready = false;
	Blend.Environment.reset();
	Blend.Environment.ready(function(){
		ready = true;
	});
	Blend.Environment.kickStart();

	t.delay(function(){
		t.isTrue(ready,'ready call');
		t.done();
	},1000);
});