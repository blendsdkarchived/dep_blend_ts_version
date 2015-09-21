/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />
/// <reference path="box-layout-utils" />

var defHBoxMargins:BoxLayoutMarginInterface = {
    left:10,
    right:10
}

var hBoxMarginViews:Array<ViewConfigInterface> = [

    {
        ctype:'ui.rect',
        margins:{
            left:10,
            right:10
        }
    },
    {
        ctype:'ui.rect',
        flex:1
    }
]

var hBoxMarginsTests:Array<ViewBoundsInterface> = [
    {
        left:0,
    },
    {
        left:10,
    }
];

createBoxTest('hbox-fix-margins','hbox',defHBoxMargins,true,eBoxLayoutPack.start , eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight, hBoxMarginViews, hBoxMarginsTests);

/////////////////////////////////////////////////////////////////////////////////////

var defVBoxMargins:BoxLayoutMarginInterface = {
    top:10,
    bottom:10
}

var vBoxMarginViews:Array<ViewConfigInterface> = [

    {
        ctype:'ui.rect',
        margins:{
            top:10,
            bottom:10
        }
    },
    {
        ctype:'ui.rect',
        flex:1
    }
]

var vBoxMarginsTests:Array<ViewBoundsInterface> = [
    {
        top:0,
    },
    {
        top:10,
    }
];

createBoxTest('vbox-fix-margins','vbox',defVBoxMargins,true,eBoxLayoutPack.start , eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight, vBoxMarginViews, vBoxMarginsTests);