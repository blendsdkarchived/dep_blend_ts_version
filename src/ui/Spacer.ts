/// <reference path="../Blend" />
/// <reference path="../dom/Dom" />
/// <reference path="View" />
/// <reference path="../interface/SpacerConfigInterface" />


module Blend.ui {

    export class Spacer extends Blend.ui.View {

        protected initialConfig: SpacerConfigInterface

        /**
         * Size in pixels
         */
        size: number
        /**
         * Size in flex units
         */
        flex: number

        constructor(config?: SpacerConfigInterface) {
            var me = this;
            super(config);
        }

        protected initConfig(config?: ViewConfigInterface) {
            var defaultConfig: ViewConfigInterface = {
                size: null,
                flex: null
            };
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        render(layoutConfig: CreateElementInterface = {}): HTMLElement {
            var me = this,
                spec = {
                    cls: Blend.cssPrefix('spacer')
                }
            return me.createElement(Blend.apply(spec, layoutConfig));
        }
    }
}