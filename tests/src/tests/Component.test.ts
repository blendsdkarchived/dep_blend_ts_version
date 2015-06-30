/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

class MyComponent1 extends Blend.Component {

    private func1() {
    }

    private func2(arg1: string): string {
        return arg1;
    }

    runf2(name:string): string {
        var me = this;
        return <string>me.applyFunction('func2', arguments);
    }
}

TestRunner.defineTest('Component', function(t: Blend.testing.TestRunner) {
    var c = new MyComponent1();
    t.isTrue(c.hasFunction('func1'), 'has func1');
    t.equal(c.runf2('test'), 'test', 'run func with applyFunction')
    t.done();
});