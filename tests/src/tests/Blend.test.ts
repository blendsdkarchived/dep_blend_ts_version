/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

module BlendTest {
    export enum enum1 {
        one,
        two,
        three
    };
}

TestRunner.defineTest('Blend', function(t: Blend.testing.TestRunner) {

    //Blend.getEnumValu
    var e: BlendTest.enum1 = BlendTest.enum1.two;
    t.equal('two', Blend.getEnumValue(BlendTest.enum1, e, 'Blend.getEnumValue'));
    t.equal('two', Blend.getEnumValue(BlendTest.enum1, 1, 'Blend.getEnumValue'));
    t.equal(1, Blend.getEnumValue(BlendTest.enum1, 'two', 'Blend.getEnumValue'));

    //Blend.apply
    var src: any = { a: 1, b: 2 }
    var dst: any = {};
    Blend.apply(dst, src)
    t.equal(dst, src, 'src eq dst');
    /////////////////////////////

    dst['x'] = 26
    t.notEqual(dst, src, 'dst neq src');

    var ar1: any = [1, 2, 3, 4]
    var ar2: any = []
    Blend.apply(ar2, ar1);
    t.equal(ar2, ar1);
    /////////////////////////////


    var o1: any = {
        nu: 1,
        ar: [1, 2]
    }

    var o2: any = {
        nu: 1,
        ar: [3, 4]
    }

    Blend.apply(o2, o1, false, true);
    t.equal(o2.ar, [3, 4, 1, 2], 'arrays merged');
    //////////////////////////////

    t.equal(Blend.wrapInArray(1), [1], 'wrap in array 1');
    t.equal(Blend.wrapInArray(['a']), ['a'], 'wrap in array ["a"]');
    /////////////////////////////

    var c1 = function() { }
    Blend.registerClassWithAlias('c1', c1);
    var oc1 = Blend.createObjectWithAlias({ ctype: 'c1' });
    t.isTrue(Blend.isInstanceOf(oc1, c1), 'obj registered and type checked');
    /////////////////////////////

    t.throws_exception(function() {
        Blend.createObjectWithAlias({ ctype: 'x1' });
    }, 'class does is not registered');
    /////////////////////////////

    var a1:IComponentConfig = {
        ctype: 'abc'
    }
    var a2:IComponentConfig = {};

    t.equal(Blend.getAlias(a1), 'abc', 'alias abc');
    t.notEqual(Blend.getAlias({}), 'no alias found');
    ////////////////////////////

    t.equal(Blend.cssPrefix('a'), 'b-a', 'prefix single string');
    t.equal(Blend.cssPrefix('a', true), ['b-a'], 'prefix single string as array');
    t.equal(Blend.cssPrefix(['a', 'b']), 'b-a b-b', 'prefix array as string');
    t.equal(Blend.cssPrefix(['a', 'b'], true), ['b-a', 'b-b'], 'prefix array as string');
    ///////////////////////////

    t.equal(Blend.ucFirst('hello'), 'Hello', 'Blend.ucFirst');
    ///////////////////////////

    t.isTrue(Blend.isNumeric(1), '1 is number');
    t.isTrue(Blend.isNumeric('1'), '"1" is number');
    t.isTrue(Blend.isNumeric('0'), '"0" is number');
    t.isFalse(Blend.isNumeric(false), 'false is not number');
    //////////////////////////

    t.isTrue(Blend.isArray([1]), '[] is array');
    t.isFalse(Blend.isArray({}), '{} is not array');
    //////////////////////////

    t.isTrue(Blend.isObject({}), '{} is an object');
    t.isFalse(Blend.isObject(null), 'null not object');
    t.isFalse(Blend.isObject([]), '[]] not object');
    t.isFalse(Blend.isObject(function() { }), 'function not object');
    t.isFalse(Blend.isObject(undefined), 'undef not object');
    t.isFalse(Blend.isObject(""), '"" not object');
    t.isFalse(Blend.isObject(11), '11 not object');
    //////////////////////////

    t.isTrue(Blend.isNullOrUndef(null), 'null is null');
    t.isTrue(Blend.isNullOrUndef(undefined), 'undefined is undefined');
    t.isFalse(Blend.isNullOrUndef('undefined'), '"undefined" is not undefined');
    ////////////////////////

    t.isTrue(Blend.isString('a'), '"a" is string')
    t.isTrue(Blend.isString('undefined'), '"undefined" is string');
    t.isFalse(Blend.isString({}), '{} is not string');
    //////////////////////

    var el = document.createElement('div');
    el.innerHTML = "<span>a</span><span>b</span><span>c</span>";
    var text:Array<string> =[];
    Blend.forEach(el.children,function(item:HTMLElement,key:number){
        text.push(item.innerHTML);
    });
    t.equal(text,['a','b','c'],'forEach HTMLCollection');

    t.done();
});