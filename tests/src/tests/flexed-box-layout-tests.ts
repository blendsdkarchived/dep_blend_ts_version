/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />
/// <reference path="box-layout-utils" />

// pack * align start

var flexedRects = [2, 1, 2];
var hflexedTests = [
    { top: 0, left: 0 },
    { top: 0, left: 160 },
    { top: 0, left: 240 }
]

var vflexedTests = [
    { left: 0, top: 0 },
    { left: 0, top: 160 },
    { left: 0, top: 240 }
]

createFlexedBoxTest('test1', 'hbox', eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight, flexedRects, hflexedTests);
createFlexedBoxTest('test2', 'hbox', eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight, flexedRects, hflexedTests);
createFlexedBoxTest('test3', 'hbox', eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight, flexedRects, hflexedTests);
createFlexedBoxTest('test4', 'hbox', eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight, flexedRects, hflexedTests);

createFlexedBoxTest('test5', 'vbox', eBoxLayoutAlign.center, eBoxLayoutDirection.LeftToRight, flexedRects, vflexedTests);
createFlexedBoxTest('test6', 'vbox', eBoxLayoutAlign.end, eBoxLayoutDirection.LeftToRight, flexedRects, vflexedTests);
createFlexedBoxTest('test7', 'vbox', eBoxLayoutAlign.start, eBoxLayoutDirection.LeftToRight, flexedRects, vflexedTests);
createFlexedBoxTest('test8', 'vbox', eBoxLayoutAlign.stretch, eBoxLayoutDirection.LeftToRight, flexedRects, vflexedTests);