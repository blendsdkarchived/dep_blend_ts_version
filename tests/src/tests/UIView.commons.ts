/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

class UITestView extends Blend.ui.View {

    layoutCount:number = 0;

    render(layoutConfig: ICreateElement = {}): HTMLElement {
        var me = this,
            spec: ICreateElement = {
                text: 'View'
            }
        return me.createElement(Blend.apply(spec, layoutConfig, false, true));
    }


    protected layoutView() {
        var me= this;
        me.layoutCount++;
        return super.layoutView.apply(me,arguments);
    }

}