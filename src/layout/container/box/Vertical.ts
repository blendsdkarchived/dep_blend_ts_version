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
            me.cssClassName = 'vbox';
            me.boxProcessor = new VBoxProcessor();
            me.marginProperyName = "height";
        }

        protected createViewMargins(view: Blend.ui.View, margins: BoxLayoutItemMarginInterface): Array<Blend.ui.View> {
            var me = this;
            me.marginA = margins.top || 0;
            me.marginB = margins.bottom || 0;
            return super.createViewMargins(view, margins);
        }


        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                direction: eBoxLayoutDirection.LeftToRight,
            };
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        protected alignAndPack() {
            var me = this,
                direction = me.layoutContext.direction === eBoxLayoutDirection.LeftToRight ? 'ltr' : 'rtl';
            Blend.Dom.setStyle(me.getViewBodyContentElement(), {
                'padding-top': me.layoutContext.packUnits || null,
                'padding-left': me.layoutContext.alignUnits || null,
                'direction': direction
            });
        }

        handleLayout(itemCtxList: Array<BoxItemContextInterface>, layoutContext: BoxLayoutContextInterface) {
            var me = this;
            me.boxProcessor.calculate(itemCtxList, layoutContext);
        }
    }
}