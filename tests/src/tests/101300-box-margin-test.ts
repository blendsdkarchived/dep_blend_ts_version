/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="box-commons" />

var testMargin: BoxLayoutMarginInterface = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
}

var fixedMarginRect1 = { ctype: 'ui.rect', color: 'red', margins: testMargin }
var fixedMarginRect2 = { ctype: 'ui.rect', color: 'green', margins: testMargin }
var fixedMarginRect3 = { ctype: 'ui.rect', color: 'blue', margins: testMargin }

var flexdMarginRect1 = { ctype: 'ui.rect', color: 'yellow', margins: { left: 10 } }
var flexdMarginRect2 = { ctype: 'ui.rect', color: 'magenta', margins: { left: 10, right: 10, top: 0, bottom: 0 }, flex: 2 }
var flexdMarginRect3 = { ctype: 'ui.rect', color: 'cyan', flex: 0.5 }

var hbox_margins = {
    ctype: 'hbox',
    align: eBoxLayoutAlign.start,
    pack: eBoxLayoutPack.start
}

boxPositionTest(
    hbox_margins,
    [fixedMarginRect1, fixedMarginRect2, fixedMarginRect3],
    [0, 0, 0],
    [10, 130, 250],
    [100, 100, 100],
    [100, 100, 100]
    );

boxPositionTest(
    hbox_margins,
    [flexdMarginRect1, flexdMarginRect2, flexdMarginRect3],
    [0, 0, 0],
    [10, 120, 342],
    [100, 212, 58],
    [100, 100, 100]
    );