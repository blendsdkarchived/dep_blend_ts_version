/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <!reference path="ui-view-commons" />

function getContainerLayoutChildViews(container: Blend.ui.Container): Array<Blend.ui.View> {
    return container.getAttribute<Blend.layout.container.Layout>('layout').getAttribute<Array<Blend.ui.View>>('childViews');
}

var testSplitters = function(t: Blend.testing.TestRunner, views: Array<Blend.ui.View>, tests: Array<string>) {
    t.equal(views.length, tests.length, 'correct number of views and splitter');
    if (views.length === tests.length) {
        Blend.forEach(tests, function(test: string, index: number) {
            var view = views[index];
            var vtype: string;
            if (Blend.isInstanceOf(view, Blend.ui.Splitter)) {
                vtype = 's';
            } else if (Blend.isInstanceOf(view, Blend.ui.Rectangle)) {
                vtype = 'r'
            } else {
                vtype = 'u';
                t.equal(vtype, 'r|s', 'not a rect or splitter to test')
            }
            t.equal(vtype, test, `View at index ${index} is correct`);
        });
    }
}


TestRunner.defineTest('container splitter strategy', function(t: Blend.testing.TestRunner) {

    var one_childview_no_split_prop = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect',
            }
        ]
    });
    t.equal(getContainerLayoutChildViews(one_childview_no_split_prop).length, 1, 'one child view no splitter property');

    ///////////////////////////////////////////////////////////////////////////////////

    var one_childview_with_split_prop = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect',
                split: true
            }
        ]
    });

    t.equal(getContainerLayoutChildViews(one_childview_with_split_prop).length, 1, 'one child view no splitter property');

    /////////////////////////////////////////////////////////////////////////////////

    var two_childview_with_split_prop_on_first = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect',
                split: true
            },
            {
                ctype: 'ui.rect'
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(two_childview_with_split_prop_on_first), ['r', 's', 'r']);

    /////////////////////////////////////////////////////////////////////////////////

    var two_childview_with_split_prop_on_last = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect',
                split: true
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(two_childview_with_split_prop_on_last), ['r', 's', 'r']);

    /////////////////////////////////////////////////////////////////////////////////

    var two_childview_with_split_prop_on_all = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect',
                split: true
            },
            {
                ctype: 'ui.rect',
                split: true
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(two_childview_with_split_prop_on_all), ['r', 's', 'r']);


    /////////////////////////////////////////////////////////////////////////////////

    var three_childview_with_split_prop_on_none = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect'
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(three_childview_with_split_prop_on_none), ['r', 'r', 'r']);


    /////////////////////////////////////////////////////////////////////////////////

    var three_childview_with_split_prop_on_all = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect',
                split: true
            },
            {
                ctype: 'ui.rect',
                split: true
            },
            {
                ctype: 'ui.rect',
                split: true
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(three_childview_with_split_prop_on_all), ['r', 's', 'r', 's', 'r']);

    /////////////////////////////////////////////////////////////////////////////////

    var three_childview_with_split_prop_on_middle = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect',
                split: true
            },
            {
                ctype: 'ui.rect'
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(three_childview_with_split_prop_on_middle), ['r', 's', 'r', 'r']);

    /////////////////////////////////////////////////////////////////////////////////

    var three_childview_with_split_prop_on_last = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect',
                split: true
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(three_childview_with_split_prop_on_last), ['r', 'r', 's', 'r']);

    /////////////////////////////////////////////////////////////////////////////////

    var three_childview_with_split_prop_on_first_and_last = new Blend.ui.Container({
        ctype: 'ui.container',
        layout: <BoxLayoutConfigInterface> {
            ctype: 'hbox',
        },
        views: [
            {
                ctype: 'ui.rect',
                split: true
            },
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect',
                split: true
            }
        ]
    });

    testSplitters(t, getContainerLayoutChildViews(three_childview_with_split_prop_on_first_and_last), ['r', 's', 'r', 's', 'r']);


    t.done();
});

/*
TestRunner.defineTest('mid-splitter-only', function(t: Blend.testing.TestRunner) {

    var app = new Blend.web.Application({
        mainView: <ContainerViewConfigInterface> {
            ctype: 'ui.container',
            bodyPadding:20,
            views: [
                <PanelConfigInterface>{
                    width:500,
                    height:350,
                    border: true,
                    title:'Hello World',
                    cssClass:'bg-gray',
                    ctype: 'ui.panel',
                    views: [
                        {
                            ctype: 'ui.rect'
                        }
                    ]
                }
            ]
        }
    });
    app.run();
});
*/
/*
TestRunner.defineTest('mid-splitter-only', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: <BoxLayoutConfigInterface> {
            ctype: 'vbox',
            pack: eBoxLayoutPack.center,
            defaultItemMargin:{
                bottom:20
            }
        },
        cssClass: 'bg-gray',
        width: 600,
        height: 400,
        top: 200,
        left: 200,
        border:true,
        views: [
            {
                ctype: 'ui.rect',
                border: true,
                color: 'red'
            },
            {
                ctype: 'ui.rect',
                color: 'green'
            },
            {
                ctype: 'ui.rect',
                border: true,
                color: 'blue'
            },
        ]
    });

    t.clearBody(cntr.getElement());
    Blend.Dom.setStyle(cntr.getElement(), {
        position: 'absolute'
    })
    cntr.performLayout();

    t.delay(function() {
        //testSplitters(t, cntr.getViews(), ['r', 's', 'r', 'r']);
        //t.done();
    });
});
*/

/*

TestRunner.defineTest('mid-splitter-only', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 1000,
        height: 400,
        top: 10,
        left: 10,
        cssClass: 'bg-gray',
        views: [
            {
                split:true,
                ctype: 'ui.container',
                cssClass: 'bg-gray',
                flex: 1,
                layout: {
                    ctype: 'hbox'
                },
                views: [
                    {
                        ctype: 'ui.container',
                        flex: 1,
                        split: true,
                        minWidth:125,
                        layout:{
                            ctype:'hbox',
                            align:eBoxLayoutAlign.center,
                            pack:eBoxLayoutPack.center
                        },
                        views:[
                            {
                                ctype:'ui.rect'
                            }
                        ]
                    },
                    {
                        ctype: 'ui.rect',
                        split: true
                    },
                    {
                        ctype: 'ui.rect',
                        split: true
                    },
                    {
                        ctype: 'ui.rect',
                        flex: 1,
                        split: true
                    }
                ]
            },
            {
                split:true,
                ctype: 'ui.container',
                cssClass: 'bg-gray2',
                flex: 1,
                layout: {
                    ctype: 'vbox'
                },
                views: [
                    {
                        ctype: 'ui.container',
                        flex: 1,
                        split: true,
                        layout:{
                            ctype:'hbox',
                            align:eBoxLayoutAlign.center,
                            pack:eBoxLayoutPack.center
                        },
                        views:[
                            {
                                ctype:'ui.rect'
                            }
                        ]
                    },
                    {
                        ctype: 'ui.rect',
                        split: true
                    },
                    {
                        ctype: 'ui.rect',
                        split: true
                    },
                    {
                        ctype: 'ui.rect',
                        flex: 1,
                        split: true
                    }
                ]

            }
        ]
    });

    var app = new Blend.web.Application({
        mainView:cntr
    });
    app.run();

    // t.clearBody(cntr.getElement());
    // Blend.Dom.setStyle(cntr.getElement(), {
    //     position: 'absolute'
    // })
    // cntr.performLayout();

    t.delay(function() {
        //testSplitters(t, cntr.getViews(), ['r', 's', 'r', 'r']);
        //t.done();
    });
});

*/