/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="mvc-common" />

TestRunner.defineTest('Model', function(t: Blend.testing.TestRunner) {

    t.throws_exception(function() {
        var m = new Blend.mvc.Model({
            id: 'mymodel',
            fields: [
                'field1',
                'field2',
                {
                    name: 'field2',
                    bindTo: ['field1', 'field2']
                }
            ]
        });
    }, 'no value() for complex field');
    /////////////////////////////////////////////


    var m = new Blend.mvc.Model({
        fields: ['title'],
        id: 'm'
    });

    var title: string = null;

    m.bind('title', function(value: string) {
        title = value;
    });

    m.setData({ title: 'test1' });
    t.equal(title, 'test1', 'model bound');
    ////////////////////////////////////////////

    var c = new Blend.mvc.Model({
        id: 'm',
        fields: [
            'field1',
            'field2',
            {
                name: 'field3',
                bindTo: ['field1', 'field2'],
                getValue: function() {
                    return this.getField1() + this.getField2();
                }
            }
        ]
    });

    var field3: string = null;
    c.bind('field3', function(value: string) {
        field3 = value;
    });
    c.setData({
        field1: 'A',
        field2: 'B'
    });
    t.equal(field3, 'AB', 'complex field set');
    ////////////////////////////////////////

    var fvalue:string = null;
    var f = new Blend.mvc.Model({
        id: "f1",
        fields: [
            {
                name: 'field1',
                formatValue: function(value: string) {
                    return value.toUpperCase();
                }
            }
        ]
    });

    f.bind('field1', function(value:string) {
        fvalue = value;
    });

    f.setData({ field1: 'aaa' });

    t.equal(fvalue, 'AAA', 'formatting');

    t.done();
});