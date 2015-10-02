/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />

var aligns = [eBoxLayoutAlign.start, eBoxLayoutAlign.center, eBoxLayoutAlign.end];
var packs = [eBoxLayoutPack.start, eBoxLayoutPack.center, eBoxLayoutPack.end];

function boxPositionTest(layoutConfig: any, viewsConfig: Array<any>, tops: Array<number>, lefts: Array<number>, widths: Array<number>, heights: Array<number>, stop: boolean = false) {

    var layoutCaption = layoutConfig.ctype + ' align:' + Blend.getEnumValue(eBoxLayoutAlign, layoutConfig.align) +
        ' pack: ' + Blend.getEnumValue(eBoxLayoutPack, layoutConfig.pack);

    var createMessage = function(index: number): string {
        return index + layoutCaption;
    }


    TestRunner.defineTest(layoutConfig.ctype + ' ' + layoutCaption, function(t: Blend.testing.TestRunner) {

        var container = new Blend.ui.Container({
            ctype: 'ui.container',
            layout: layoutConfig,
            views: viewsConfig,
            width: 400,
            height: 400,
            cssClass: 'bg-gray'
        })

        var app = new Blend.web.Application({
            mainView: {
                layout: 'flow',
                ctype: 'ui.container',
                views: [container]
            }
        });
        app.run();
        t.delay(function() {

            var bounds: ViewBoundsInterface;
            if (tops !== null) {

                Blend.forEach(container.getViews(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.equal(Math.round(bounds.top), tops[index], 'Top of View ' + createMessage(index) + ' test');
                });
            }
            if (lefts !== null) {
                Blend.forEach(container.getViews(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.equal(Math.round(bounds.left), lefts[index], 'Left of View ' + index + ' test');
                });
            }
            if (widths !== null) {
                Blend.forEach(container.getViews(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.equal(Math.round(<number>bounds.width), widths[index], 'Width of View ' + index + ' test');
                });
            }
            if (heights !== null) {
                Blend.forEach(container.getViews(), function(view: Blend.ui.View, index: number) {
                    bounds = view.getBounds();
                    t.equal(Math.round(<number>bounds.height), heights[index], 'Heigh of View ' + index + ' test');
                });
            }
            if (stop === false) {
                t.done();
            }
        });
    });
}