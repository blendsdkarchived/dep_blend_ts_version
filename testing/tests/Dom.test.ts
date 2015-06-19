///<reference path="../../src/testing/TestRunner.ts"/>
///<reference path="../src/TestApp.ts"/>
///<reference path="../../src/Blend.ts"/>
///<reference path="../../src/utils/Dom.ts"/>

TestRunner.defineTest('Core', 'Dom', function(t: Blend.testing.TestRunnerSingleton) {
	
	t.delay(function(){
		var me = this;
		var child:HTMLElement;
		var el:HTMLElement		
		Blend.Dom.createElement({
			text:'element',
			children: [
				{
					tag:'span'
				},
				{
					tag:'a',
					oid:'link'
				}
			]
		},function(el:HTMLElement,oid:string){
			t.isTrue(oid === 'link');
			console.log(el);
			t.isTrue(Blend.isInstanceOf(el,HTMLAnchorElement));
			t.done();
		},me);
	})
	
});