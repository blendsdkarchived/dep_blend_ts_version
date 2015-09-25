/// <reference path="../../interface/LayoutConfigInterface" />
/// <reference path="../../Blend" />
/// <reference path="../Layout" />
/// <reference path="../../web/Application" />
/// <reference path="../..//ui/View" />


module Blend.layout.web {

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