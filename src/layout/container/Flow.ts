/// <reference path="Layout" />

module Blend.layout.container {

    export class Flow extends Blend.layout.container.Layout {

        protected initialConfig: ContainerLayoutConfigInterface;

        constructor(config: ContainerLayoutConfigInterface) {
            var me = this;
            me.layoutCssClass = 'flow';
            super(config);
        }

    }
}