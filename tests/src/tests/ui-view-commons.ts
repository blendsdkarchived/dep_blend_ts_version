/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />

class UITestView extends Blend.ui.View {

    layoutCount: number = 0;

    render(layoutConfig: CreateElementInterface = {}): HTMLElement {
        var me = this,
            spec: CreateElementInterface = {
                text: 'View'
            }
        return me.createElement(Blend.apply(spec, layoutConfig, false, true));
    }


    protected layoutView() {
        var me = this;
        me.layoutCount++;
        return super.layoutView.apply(me, arguments);
    }

}

class UITestContainerView extends Blend.ui.ContainerView {

    getBodyContentElement(): HTMLElement {
        var me = this;
        return me.bodyContentElement;
    }

}

class UITestUtils {
    static createRects(counts: number, template: any = {}): Array<ComponentConfigInterface> {
        var result: Array<ComponentConfigInterface> = [];
        for (var a = 0; a != counts; a++) {
            result.push(Blend.apply({
                ctype: 'ui.rect',
                color:'#fff'
            }, template))
        }
        return result;
    }
}