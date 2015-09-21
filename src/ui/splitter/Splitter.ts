/// <reference path="../../Blend" />
/// <reference path="../../dom/Dom" />
/// <reference path="../View" />
/// <reference path="../../interface/SplitterConfigInterface" />


module Blend.ui.splitter {

    export class Splitter extends Blend.ui.View {

        protected initialConfig: SplitterConfigInterface;
        protected splitType: string;

        constructor(config?: SplitterConfigInterface) {
            var me = this;
            super(config);
            me.splitType = me.initialConfig.splitType;
        }

        render(layoutConfig: CreateElementInterface = {}): HTMLElement {
            var me = this,
                spec = {
                    cls: Blend.cssPrefix(['splitter', 'splitter-' + me.splitType]),
                    innerHTML: '&nbsp;'
                }
            return me.createElement(Blend.apply(spec, layoutConfig));
        }
    }
}