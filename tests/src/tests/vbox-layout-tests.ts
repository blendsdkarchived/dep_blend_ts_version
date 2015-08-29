/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />
/// <reference path="box-layout-utils" />

// pack * align start
createFixedBoxTest('test1', 'vbox', eBoxLayoutPack.start, eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight,
    [
        { left: 0, top: 0 },
        { left: 0, top: 100 },
        { left: 0, top: 200 }
    ]);

createFixedBoxTest('test2', 'vbox', eBoxLayoutPack.center, eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight,
    [
        { left: 0, top: 50 },
        { left: 0, top: 150 },
        { left: 0, top: 250 }
    ]);

createFixedBoxTest('test3', 'vbox', eBoxLayoutPack.end, eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight,
    [
        { left: 0, top: 100 },
        { left: 0, top: 200 },
        { left: 0, top: 300 }
    ]);
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// pack * align center
createFixedBoxTest('test4', 'vbox', eBoxLayoutPack.start, eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight,
    [
        { left: 150, top: 0 },
        { left: 150, top: 100 },
        { left: 150, top: 200 }
    ]);

createFixedBoxTest('test5', 'vbox', eBoxLayoutPack.center, eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight,
    [
        { left: 150, top: 50 },
        { left: 150, top: 150 },
        { left: 150, top: 250 }
    ]);

createFixedBoxTest('test6', 'vbox', eBoxLayoutPack.end, eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight,
    [
        { left: 150, top: 100 },
        { left: 150, top: 200 },
        { left: 150, top: 300 }
    ]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// pack * align end
createFixedBoxTest('test7', 'vbox', eBoxLayoutPack.start, eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight,
    [
        { left: 300, top: 0 },
        { left: 300, top: 100 },
        { left: 300, top: 200 }
    ]);

createFixedBoxTest('test8', 'vbox', eBoxLayoutPack.center, eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight,
    [
        { left: 300, top: 50 },
        { left: 300, top: 150 },
        { left: 300, top: 250 }
    ]);

createFixedBoxTest('test9', 'vbox', eBoxLayoutPack.end, eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight,
    [
        { left: 300, top: 100 },
        { left: 300, top: 200 },
        { left: 300, top: 300 }
    ]);
////////////////////////////////////////////////////////////////////////////////////////////////////////
// pack * align stretch
createFixedBoxTest('test10', 'vbox', eBoxLayoutPack.start, eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight,
    [
        { left: 0, top: 0, height: 100, width: 400 },
        { left: 0, top: 100, height: 100, width: 400 },
        { left: 0, top: 200, height: 100, width: 400 },
    ]);

createFixedBoxTest('test11', 'vbox', eBoxLayoutPack.center, eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight,
    [
        { left: 0, top: 50, height: 100, width: 400 },
        { left: 0, top: 150, height: 100, width: 400 },
        { left: 0, top: 250, height: 100, width: 400 }
    ]);

createFixedBoxTest('test12', 'vbox', eBoxLayoutPack.end, eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight,
    [
        { left: 0, top: 100, height: 100, width: 400 },
        { left: 0, top: 200, height: 100, width: 400 },
        { left: 0, top: 300, height: 100, width: 400 }
    ]);
///////////////////////////////////////////////////////////////////////////////////////////////////////////