/// <reference path="../../../interface/BoxLayoutInterface" />
/// <reference path="../Layout" />
/// <reference path="Box" />
/// <reference path="../../Util" />
/// <reference path="../../utils/box/HBoxProcessor" />


module Blend.layout.container.box {

    export class Horizontal extends Blend.layout.container.box.Box {

        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            super(config);
            me.cssClassName = 'hbox';
            me.boxProcessor = new HBoxProcessor();
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                direction: eBoxLayoutDirection.LeftToRight,
            };
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        protected alignAndPack() {
            var me = this,
                direction = me.layoutContext.direction === eBoxLayoutDirection.LeftToRight ? 'ltr' : 'rtl',
                pack = 'padding-' + (direction === 'ltr' ? 'left' : 'right'),
                props: StyleConfigiInterface = {
                    'padding-top': me.layoutContext.alignUnits || null,
                    'direction': direction
                };
            props[pack] = me.layoutContext.packUnits || null;
            Blend.Dom.setStyle(me.getViewBodyContentElement(), props);
        }

        handleLayout(itemCtxList: Array<BoxItemContextInterface>, layoutContext: BoxLayoutContextInterface) {
            var me = this;
            me.boxProcessor.calculate(itemCtxList, layoutContext);
        }
    }
}