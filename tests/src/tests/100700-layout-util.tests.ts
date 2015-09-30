/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />


TestRunner.defineTest('LayoutUtil-Fit', function(t: Blend.testing.TestRunner) {

    t.isOk(Blend.LayoutUtil, 'layout util exists');

    var el = Blend.Dom.createElement({
        style: {
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            position: 'absolute',
            'background-color': 'silver'
        }
    });

    var fittedEl = Blend.Dom.createElement({
        style: {
            'background-color': 'yellow'
        }
    });


    el.appendChild(fittedEl);
    t.clearBody(el);
    Blend.LayoutUtil.fitElement(fittedEl);

    t.delay(function() {
        var bounds = Blend.Dom.getBounds(fittedEl);
        t.equal(bounds.top, 0, 'top is ok');
        t.equal(bounds.left, 0, 'left is ok');
        t.equal(bounds.width, 200, 'width is ok');
        t.equal(bounds.height, 200, 'height is ok');
        t.done();
    });

});



TestRunner.defineTest('LayoutUtil-Center', function(t: Blend.testing.TestRunner) {

    t.isOk(Blend.LayoutUtil, 'layout util exists');

    var el = Blend.Dom.createElement({
        style: {
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            position: 'absolute',
            'background-color': 'silver'
        }
    });

    var fittedEl = Blend.Dom.createElement({
        style: {
            'background-color': 'red',
            width: 50,
            height:50
        }
    });


    el.appendChild(fittedEl);
    t.clearBody(el);
    Blend.LayoutUtil.centerElement(fittedEl);

    t.delay(function() {

        //top and left are set to 100 (50% of the parent) and then translated -50% (of the child element)
        // so it is 100 instead of 75!!
        var bounds = Blend.Dom.getBounds(fittedEl);
        t.equal(bounds.top, 100, 'top is ok');
        t.equal(bounds.left, 100, 'left is ok');
        t.equal(bounds.width, 50, 'width is ok');
        t.equal(bounds.height, 50, 'height is ok');
        t.done();
    });

});