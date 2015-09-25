/// <reference path="../../Blend" />
/// <reference path="../../ui/container/View" />
/// <reference path="../../interface/PanelConfigInterface" />
/// <reference path="../../interface/CreateElementInterface" />

module Blend.ui.panel {

    export class Panel extends Blend.ui.container.View {

        protected initialConfig: PanelConfigInterface;

        constructor(config?: PanelConfigInterface) {
            var me = this;
            super(config);
        }

        protected initConfig(config?: PanelConfigInterface) {

            var defaultConfig: PanelConfigInterface = {
                icon: null,
                title: null,
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        render(layoutConfig: CreateElementInterface = {}): HTMLElement {
            var me = this,
                spec: CreateElementInterface = {
                    cls: Blend.cssPrefix(['container','panel']),
                    unselectable: true,
                    children: [
                    ]
                };
            return me.createElement(spec, function(el: HTMLElement, oid: string) {
                me.setAttribute(oid, el);
            }, me);
        }

        finalizeRender() {
            var me = this;
            super.finalizeRender();
        }
    }
}