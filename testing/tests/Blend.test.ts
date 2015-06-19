///<reference path="../../src/testing/TestRunner.ts"/>
///<reference path="../src/TestApp.ts"/>
///<reference path="../../src/Blend.ts"/>

module test_sanity {
	export class Class1 {
		
	}
}

TestRunner.defineTest('Core', 'Blend', function(t: Blend.testing.TestRunnerSingleton) {
	
	t.isOk(Blend);
	
	//ucFirst	
	t.equal(Blend.ucFirst('aaA'),'AaA');
	
	//isArray
	t.isTrue(Blend.isArray([]));
	t.isFalse(Blend.isArray({}));
	
	//isObject
	t.isFalse(Blend.isObject(1));
	t.isFalse(Blend.isObject([]));
	t.isTrue(Blend.isObject({}));
	t.isFalse(Blend.isObject(function(){}));
	
	//isString
	t.isFalse(Blend.isString(1));
	t.isTrue(Blend.isString('A'));
	t.isFalse(Blend.isString({}));
	
	//isFunction
	t.isFalse(Blend.isFunction({}));
	t.isTrue(Blend.isFunction(function(){}));
	
	//isInstanceOf
	var o = new test_sanity.Class1();
	t.isTrue(Blend.isInstanceOf(o,test_sanity.Class1));
	t.isTrue(Blend.isInstanceOf(o,'test_sanity.Class1'))
	t.isFalse(Blend.isInstanceOf(o,'Number'));
	
	//forEach
	var ar = [1,1,1,1];	
	var arTotal=0;	
	Blend.forEach(ar,function(item,index){
		arTotal += <number>item;
	});
	t.equal(arTotal,4);
	
	var obj = {a:'A',b:'A'}
	var objTotal=''	
	Blend.forEach(obj,function(val,key){
		objTotal += `${key}${val}`;
	});
	t.equal(objTotal,'aAbA');
	
	t.done();
});
