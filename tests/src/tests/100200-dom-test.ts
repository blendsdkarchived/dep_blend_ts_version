/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />

TestRunner.defineTest('Dom', function(t: Blend.testing.TestRunner) {
    var el: HTMLElement = document.createElement('div');

    t.equal(Blend.Dom.cssClass(el), {}, 'no cls classes');
    ///////////////////////////////////

    document.body.innerHTML = '<div class="c1">test</div>';
    el = <HTMLElement>document.body.children[0];
    t.equal(Blend.Dom.cssClass(el), { c1: true }, 'read existing cls');
    /////////////////////////////////////////////////////

    Blend.Dom.cssClass(el, { c1: false, cx: true });
    t.equal(Blend.Dom.cssClass(el), { cx: true }, 'c1 removed cx added');
    /////////////////////////////////////////////////////

    Blend.Dom.cssClass(el, 'cy');
    t.equal(Blend.Dom.cssClass(el), { cx: true, cy: true }, 'cy added');
    ////////////////////////////////////////////////////

    var e1 = Blend.Dom.createElement({});
    document.body.appendChild(e1);
    t.equal(e1.outerHTML, '<div></div>');
    ///////////////////////////////////////////////////

    var e2 = Blend.Dom.createElement({
        style: {
            'background-color': 'red'
        }
    });
    document.body.appendChild(e2);
    t.isTrue(e2.outerHTML.indexOf('background-color') !== -1, 'style set');
    //////////////////////////////////////////////////

    var e3 = Blend.Dom.createElement({
        cls: ['c1']
    });
    document.body.appendChild(e3);
    t.isTrue(e3.outerHTML.indexOf('c1') !== -1, 'cls set');
    ////////////////////////////////////////////////
    var e4 = Blend.Dom.createElement({
        children: [
            {
                tag: 'span'
            }
        ]
    });
    document.body.appendChild(e4);
    t.equal(e4.outerHTML, '<div><span></span></div>', 'child added');
    /////////////////////////////////////////////////

    var e5 = Blend.Dom.createElement({
        unselectable: true
    });
    document.body.appendChild(e5);
    t.isTrue(e5.outerHTML.indexOf('unselectable="on"') !== -1, 'unselectable set');
    /////////////////////////////////////////////////

    var e6 = Blend.Dom.createElement({
        extra: {

            'data-test': true
        }
    });
    document.body.appendChild(e6);
    t.isTrue(e6.outerHTML.indexOf('data-test="true"') !== -1, 'extra attr set');

    var e7:HTMLElement = Blend.Dom.createElement({});
    document.body.appendChild(e7);
    Blend.Dom.setStyle(e7,{
        width:'calc(100% - 50px)'
    });
    t.equal(e7.style.getPropertyValue('width'),'calc(100% - 50px)','calc data set');

    t.done();
});