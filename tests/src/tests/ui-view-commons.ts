/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

class UITestView extends Blend.ui.View {

    layoutCount: number = 0;

    render(layoutConfig: ICreateElement = {}): HTMLElement {
        var me = this,
            spec: ICreateElement = {
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
    static createRects(counts: number, template: any = {}): Array<IComponentConfig> {
        var result: Array<IComponentConfig> = [];
        for (var a = 0; a != counts; a++) {
            result.push(Blend.apply({
                ctype: 'ui.rect',
                xcolor: '#fff',
                width: Math.floor(Math.random() * (500 - 100)) + 100,
                height: Math.floor(Math.random() * (500 - 100)) + 100
            }, template))
        }
        return result;
    }
}