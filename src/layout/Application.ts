/// <reference path="../interface/LayoutConfigInterface" />
/// <reference path="../interface/CreateElementInterface" />
/// <reference path="../Blend" />
/// <reference path="Layout" />
/// <reference path="../Application" />
/// <reference path="../ui/View" />


module Blend.layout {

    export class Application extends Blend.layout.Layout {

        protected view: Blend.Application

        performLayout() {
            var me = this,
                mainView = me.view.getMainView();
            Blend.LayoutUtil.fitElement(me.view.getElement());
            Blend.LayoutUtil.fitElement(mainView.getElement());
            mainView.invalidateLayout();
            mainView.performLayout();
            this.view.doneLayout();
        }

        render(): HTMLElement {
            var me = this,
                spec: CreateElementInterface = {
                    children: [me.view.getMainView().getElement()]
                }
            return super.render(spec);
        }

    }
}