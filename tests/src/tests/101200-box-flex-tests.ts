/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="box-commons" />

var flex_hbox: BoxLayoutConfigInterface = {
    ctype: 'hbox',
    align: eBoxLayoutAlign.stretch,
    pack: eBoxLayoutPack.start
}

var flexRect1 = { ctype: 'ui.rect', flex: 1 };
var flexRect2 = { ctype: 'ui.rect', flex: 2 };
var flexRect3 = { ctype: 'ui.rect', flex: 1 };

boxPositionTest(
    flex_hbox,
    [flexRect1, flexRect2, flexRect3],
    [0, 0, 0],
    [0, 100, 300],
    [100, 200, 100],
    [400, 400, 400]
);


var flex_vbox: BoxLayoutConfigInterface = {
    ctype: 'vbox',
    align: eBoxLayoutAlign.stretch,
    pack: eBoxLayoutPack.start
}

boxPositionTest(
    flex_vbox,
    [flexRect1, flexRect2, flexRect3],
    [0, 100, 300],
    [0, 0, 0],
    [400, 400, 400],
    [100, 200, 100]
);