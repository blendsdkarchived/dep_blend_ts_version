/// <reference path="../../../Blend.ts" />
/// <reference path="../../Layout.ts" />
/// <reference path="../../../web/Application.ts" />
/// <reference path="../../../ui/View.ts" />

module Blend.layout.component.web {

    export class Application extends Layout {

        protected view: Blend.web.Application

        performLayout() {
            var me = this,
            mainView = me.view.getMainView();

            Blend.LayoutUtil.fitElement(me.view.getElement());
            Blend.LayoutUtil.fitElement(mainView.getElement());
            mainView.invalidateLayout();
            mainView.performLayout();
            this.view.doneLayout();
        }

        constructor(config: LayoutConfigInterface) {
            var me = this;
            super(config);
            me.cssClassName = 'application';
            me.view = <Blend.web.Application>me.initialConfig.view;
        }
    }
}