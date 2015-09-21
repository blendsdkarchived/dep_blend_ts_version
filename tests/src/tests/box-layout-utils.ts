/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />

var createBoxTest = function(name: string, layout: string, defMargins: BoxLayoutMarginInterface, hasMargins: boolean, pack: eBoxLayoutPack, align: eBoxLayoutAlign, direction: eBoxLayoutDirection, testViews: Array<ViewConfigInterface>, tests: Array<ViewBoundsInterface>) {

    TestRunner.defineTest('Box-Layout-' + name + '-test', function(t: Blend.testing.TestRunner) {

        var container = <ContainerViewConfigInterface>{
            layout: <BoxLayoutConfigInterface> {
                ctype: layout,
                pack: pack,
                align: align,
                direction: direction,
                defaultItemMargin: defMargins
            },
            width: 400,
            height: 400,
            cssClass: 'bg-gray',
            views: testViews
        }

        var c = new Blend.ui.container.View(container);
        Blend.Dom.clearElement(Blend.Dom.getBodyElement());
        Blend.Dom.setStyle(c.getElement(), {
            'visibility': 'hidden'
        });
        Blend.Dom.getBodyElement(c.getElement());

        var views = c.getViews();
        var r1 = views[0].getElement().getBoundingClientRect();
        var r2 = views[1].getElement().getBoundingClientRect();
        var r3 = views[2].getElement().getBoundingClientRect();

        var strAlign = <string>Blend.getEnumValue(eBoxLayoutAlign, align);
        var strPack = <string>Blend.getEnumValue(eBoxLayoutPack, pack);
        var strDirection = <string>Blend.getEnumValue(eBoxLayoutDirection, direction);

        name = `${name}/P:${strPack}/A:${strAlign}/D:${strDirection}`;

        t.delay(function() {

            c.performLayout();

            t.delay(function() {
                Blend.Dom.setStyle(c.getElement(), {
                    'visibility': 'visible'
                });

                t.delay(function() {
                    Blend.forEach(tests, function(test: ViewBoundsInterface, index: number) {
                        var bounds = views[index].getElement().getBoundingClientRect();
                        if (test.top) {
                            t.equal(test.top, bounds.top, `${name } /V:${index}/top`);
                        }
                        if (test.left) {
                            t.equal(test.left, bounds.left, `${name } /V:${index}/left`);
                        }
                        if (test.width) {
                            t.equal(test.width, bounds.width, `${name } /V:${index}/width`);
                        }

                        if (test.height) {
                            t.equal(test.height, bounds.height, `${name } /V:${index}/height`);
                        }
                    });
                    if (!hasMargins) {
                        t.equal(views.length, 3, name + ' tested');
                    }
                    t.done();
                }, 100);
            });
        });
    });
}

var createFixedBoxTest = function(name: string, layout: string, pack: eBoxLayoutPack, align: eBoxLayoutAlign, direction: eBoxLayoutDirection, tests: Array<ViewBoundsInterface>) {
    var testViews: Array<ViewConfigInterface> = [
        {
            ctype: 'ui.rect'
        },
        {
            ctype: 'ui.rect'
        },
        {
            ctype: 'ui.rect'
        }
    ];
    createBoxTest(name, layout, null, false, pack, align, direction, testViews, tests);
}


var createFlexedBoxTest = function(name: string, layout: string, align: eBoxLayoutAlign, direction: eBoxLayoutDirection, flexes: Array<number>, tests: Array<ViewBoundsInterface>) {
    var testViews: Array<ViewConfigInterface> = [];
    Blend.forEach(flexes, function(value: number) {
        testViews.push({
            ctype: 'ui.rect',
            flex: value
        });
    });
    createBoxTest(name, layout, null, false, eBoxLayoutPack.start, align, direction, testViews, tests);
}