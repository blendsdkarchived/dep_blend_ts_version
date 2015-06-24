/// <reference path="../Layout.ts" />
/// <reference path="../../ui/Container.ts" />
module Blend.layout.container {
    export class Layout extends Blend.layout.Layout {

        view: Blend.ui.Container;

        constructor(config: ILayoutConfig, view: Blend.ui.View) {
            var me = this;
            super(config, view);
            me.cssKeyName = 'container-layout'
        }

        performLayout() {
            var me = this;
            Blend.forEach((<Blend.ui.Container>me.view).children, function(view: Blend.ui.View) {
                view.performLayout();
            });
            super.performLayout();
        }

        render() {
            var me = this;
            var el: HTMLElement = super.render.apply(me, arguments);
            Blend.forEach(me.view.children, function(item: Blend.ui.View) {
                var el: HTMLElement = item.getElement();
                Blend.Dom.cssClass(el, <string>Blend.cssPrefix('layout-item'));
                me.view.bodyContentElement.appendChild(el);
            });
            return el;
        }

    }   
}
Blend.registerClassWithAlias('layout.container', Blend.layout.container.Layout);