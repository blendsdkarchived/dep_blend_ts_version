/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

TestRunner.defineTest('Application fit into window', function(t: Blend.testing.TestRunner) {

    var app = new Blend.web.Application({
        mainView: {
            ctype: 'ui.rect'
        }
    });

    app.run();

    t.delay(function() {
        var el: HTMLElement = app.getElement();
        var s: IViewBounds = Blend.Dom.getStyle(el, ['width', 'height']);
        t.equal(s.width, window.innerWidth, 'full width is ok');
        t.equal(s.height, window.innerHeight, 'full height is ok');
        t.done();
    });
});