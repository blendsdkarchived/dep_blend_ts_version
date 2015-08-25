/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

class MyComponent1 extends Blend.Component {

    private func1() {
    }

    private func2(arg1: string): string {
        return arg1;
    }

    runf2(name: string): string {
        var me = this;
        return <string>me.applyFunction('func2', arguments);
    }
}

class Person extends Blend.Component {

    protected initConfig(config?: DictionaryInterface) {

        var defaultConfig: DictionaryInterface = {
            firstname: null,
            lastname: null
        };

        return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
    }

    prepare() {
        var me = this;
        Blend.apply(me, me.initialConfig);
    }

}

class Employee extends Person {

    protected initConfig(config?: DictionaryInterface) {
        var defaultConfig: DictionaryInterface = {
            empNumber: null,
            salary: 3500,
        }
        return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
    }
}

class Developer extends Employee {
    protected initConfig(config?: DictionaryInterface) {
        var defaultConfig = {
            salary: 5000
        }
        return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
    }
}


TestRunner.defineTest('Component', function(t: Blend.testing.TestRunner) {
    var c = new MyComponent1();
    t.isTrue(c.hasFunction('func1'), 'has func1');
    t.equal(c.runf2('test'), 'test', 'run func with applyFunction')
    t.done();
});

TestRunner.defineTest('Component-initConfig', function(t: Blend.testing.TestRunner) {
    var d = new Developer();
    d.prepare();
    t.equal(d.getAttribute('salary'), 5000, 'init config chain test 1');

    var x = new Developer({
        salary: 10000,
        empNumber: 1,
        firstname: 'Jane'
    });
    x.prepare();
    t.equal(x.getAttribute('salary'), 10000, 'init config chain test 2');
    t.equal(x.getAttribute('empNumber'), 1, 'init config chain test 3');
    t.equal(x.getAttribute('firstname'), 'Jane', 'init config chain test 4');

    t.done();

});