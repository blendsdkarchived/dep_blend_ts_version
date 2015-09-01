/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />
/// <reference path="box-layout-utils" />

// pack * align start
createFixedBoxTest('test1', 'hbox', eBoxLayoutPack.start, eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight,
    [
        { top: 0, left: 0 },
        { top: 0, left: 100 },
        { top: 0, left: 200 }
    ]);

createFixedBoxTest('test2', 'hbox', eBoxLayoutPack.center, eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight,
    [
        { top: 0, left: 50 },
        { top: 0, left: 150 },
        { top: 0, left: 250 }
    ]);

createFixedBoxTest('test3', 'hbox', eBoxLayoutPack.end, eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight,
    [
        { top: 0, left: 100 },
        { top: 0, left: 200 },
        { top: 0, left: 300 }
    ]);
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// pack * align center
createFixedBoxTest('test4', 'hbox', eBoxLayoutPack.start, eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight,
    [
        { top: 150, left: 0 },
        { top: 150, left: 100 },
        { top: 150, left: 200 }
    ]);

createFixedBoxTest('test5', 'hbox', eBoxLayoutPack.center, eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight,
    [
        { top: 150, left: 50 },
        { top: 150, left: 150 },
        { top: 150, left: 250 }
    ]);

createFixedBoxTest('test6', 'hbox', eBoxLayoutPack.end, eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight,
    [
        { top: 150, left: 100 },
        { top: 150, left: 200 },
        { top: 150, left: 300 }
    ]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// pack * align end
createFixedBoxTest('test7', 'hbox', eBoxLayoutPack.start, eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight,
    [
        { top: 300, left: 0 },
        { top: 300, left: 100 },
        { top: 300, left: 200 }
    ]);

createFixedBoxTest('test8', 'hbox', eBoxLayoutPack.center, eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight,
    [
        { top: 300, left: 50 },
        { top: 300, left: 150 },
        { top: 300, left: 250 }
    ]);

createFixedBoxTest('test9', 'hbox', eBoxLayoutPack.end, eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight,
    [
        { top: 300, left: 100 },
        { top: 300, left: 200 },
        { top: 300, left: 300 }
    ]);
////////////////////////////////////////////////////////////////////////////////////////////////////////
// pack * align stretch
createFixedBoxTest('test10', 'hbox', eBoxLayoutPack.start, eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight,
    [
        { top: 0, left: 0, width: 100, height: 400 },
        { top: 0, left: 100, width: 100, height: 400 },
        { top: 0, left: 200, width: 100, height: 400 },
    ]);

createFixedBoxTest('test11', 'hbox', eBoxLayoutPack.center, eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight,
    [
        { top: 0, left: 50, width: 100, height: 400 },
        { top: 0, left: 150, width: 100, height: 400 },
        { top: 0, left: 250, width: 100, height: 400 }
    ]);

createFixedBoxTest('test12', 'hbox', eBoxLayoutPack.end, eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight,
    [
        { top: 0, left: 100, width: 100, height: 400 },
        { top: 0, left: 200, width: 100, height: 400 },
        { top: 0, left: 300, width: 100, height: 400 }
    ]);
///////////////////////////////////////////////////////////////////////////////////////////////////////////