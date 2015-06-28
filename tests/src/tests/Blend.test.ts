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
    var src:any = {a:1,b:2}
    var dst:any = {};
    Blend.apply(dst,src)
    t.equal(dst,src,'src eq dst');
    /////////////////////////////

    dst['x'] = 26
    t.notEqual(dst,src,'dst neq src');

    var ar1:any = [1,2,3,4]
    var ar2:any = []
    Blend.apply(ar2,ar1);
    t.equal(ar2,ar1);
    /////////////////////////////


    var o1:any = {
        nu:1,
        ar:[1,2]
    }

    var o2:any = {
        nu:1,
        ar:[3,4]
    }

    Blend.apply(o2,o1,false,true);
    t.equal(o2.ar,[3,4,1,2],'arrays merged');
    //////////////////////////////
    t.equal(Blend.wrapInArray(1),[1],'wrap in array 1');
    t.equal(Blend.wrapInArray(['a']),['a'],'wrap in array ["a"]');
    /////////////////////////////
    var c1 = function() {}
    Blend.registerClassWithAlias('c1',c1);
    var oc1 = Blend.createObjectWithAlias('c1',{});
    t.isTrue(Blend.isInstanceOf(oc1,c1),'obj registered and type checked');
    /////////////////////////////
    t.throws_exception(function(){
        Blend.createObjectWithAlias('x1',{});
    },'class does is not registered');
    /////////////////////////////

    t.done();
});