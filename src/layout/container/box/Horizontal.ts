/// <reference path="Box" />
/// <reference path="HBoxProcessor" />


module Blend.layout.container.box {

    export class Horizontal extends Blend.layout.container.box.Box {

        protected initialConfig: BoxLayoutConfigInterface;

        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            me.layoutCssClass = 'hbox';
            me.boxedProperty = 'width';
            me.sizeProperty = 'height';
            me.marginBeforeProperty = 'left';
            me.marginAfterProperty = 'right';
            me.boxProcessor = new HBoxProcessor();
            super(config);
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                direction: eBoxLayoutDirection.LeftToRight
            }

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

    }
}