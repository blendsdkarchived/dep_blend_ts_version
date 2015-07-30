/// <reference path="../../../Blend.ts" />
/// <reference path="../../Layout.ts" />
/// <reference path="../../../web/Application.ts" />
/// <reference path="../../../ui/View.ts" />




module Blend.layout.component.web {

    export class Application extends Layout {

        protected view: Blend.web.Application

        performLayout() {
            var me = this;
            Blend.LayoutUtil.fitElement(me.view.getElement());
            Blend.LayoutUtil.fitElement(me.view.getMainView().getElement());
            this.view.doneLayout();
        }

        constructor(config: ILayoutConfig) {
            var me = this;
            super(config);
            me.cssClassName = 'application';
            me.view = <Blend.web.Application>me.initialConfig.view;
        }
    }
}

Blend.registerClassWithAlias('layout.application', Blend.layout.component.web.Application);