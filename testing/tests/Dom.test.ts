///<reference path="../../src/testing/TestRunner.ts"/>
///<reference path="../src/TestApp.ts"/>
///<reference path="../../src/Blend.ts"/>
///<reference path="../../src/utils/Dom.ts"/>

TestRunner.defineTest('Dom', 'OID', function(t: Blend.testing.TestRunnerSingleton) {

    t.delay(function() {
        var me = this;
        var child: HTMLElement;
        var el: HTMLElement
        Blend.Dom.createElement({
            text: 'element',
            children: [
                {
                    tag: 'span'
                },
                {
                    tag: 'a',
                    oid: 'link'
                }
            ]
        }, function(el: HTMLElement, oid: string) {
            t.isTrue(oid === 'link');
            t.isTrue(Blend.isInstanceOf(el, HTMLAnchorElement));
            t.done();
        }, me);
    })

});

TestRunner.defineTest('DOM', 'cssClass', function(t: Blend.testing.TestRunnerSingleton) {

    var el = Blend.Dom.createElement({});
    var cls = Blend.Dom.cssClass(el);
    t.equal(cls, {}, 'no css class');

    el.setAttribute('class', 'a b c');
    var cls = Blend.Dom.cssClass(el);
    t.equal({ 'a': true, 'b': true, 'c': true }, cls, 'read classes');

    Blend.Dom.cssClass(el, 'd');
    cls = Blend.Dom.cssClass(el);
    t.equal({ 'a': true, 'b': true, 'c': true, 'd': true }, cls, 'added obj cls');

    Blend.Dom.cssClass(el, { 'a': false, 'b': false, 'c': false, 'd': true });
    cls = Blend.Dom.cssClass(el);
    t.equal({ 'd': true }, cls, 'remove obj cls');

    Blend.Dom.cssClass(el, { 'x': false });
    cls = Blend.Dom.cssClass(el);
    t.equal({ 'd': true }, cls, 'remove non existant cls');

    t.done();
});