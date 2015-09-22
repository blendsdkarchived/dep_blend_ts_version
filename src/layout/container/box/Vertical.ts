/// <reference path="../../../interface/BoxLayoutInterface" />
/// <reference path="../Layout" />
/// <reference path="Box" />
/// <reference path="../../Util" />
/// <reference path="../../utils/box/VBoxProcessor" />


module Blend.layout.container.box {

    export class Vertical extends Blend.layout.container.box.Box {

        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            super(config);
            me.cssClassName = me.splitterType = 'vbox';
            me.boxProcessor = new VBoxProcessor();
            me.marginProperyName = "height";
        }

        protected createViewMargins(view: Blend.ui.View, margins: BoxLayoutMarginInterface): Array<Blend.ui.View> {
            var me = this;
            me.marginBefore = margins.top || 0;
            me.marginAfter = margins.bottom || 0;
            return super.createViewMargins(view, margins);
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                direction: eBoxLayoutDirection.LeftToRight,
            };
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        handleLayout(itemCtxList: Array<BoxItemContextInterface>, layoutContext: BoxLayoutContextInterface) {
            var me = this;
            me.boxProcessor.calculate(itemCtxList, layoutContext);
        }
    }
}