/// <reference path="Box" />
/// <reference path="VBoxProcessor" />

module Blend.layout.container.box {

    export class Vertical extends Blend.layout.container.box.Box {

        protected initialConfig: BoxLayoutConfigInterface;

        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            me.layoutCssClass = 'vbox';
            me.boxedProperty = 'height';
            me.sizeProperty = 'width';
            me.marginBeforeProperty = 'top';
            me.marginAfterProperty = 'bottom';
            me.boxProcessor = new VBoxProcessor();
            super(config);
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                direction: eBoxLayoutDirection.TopToBottom
            }

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }


    }
}