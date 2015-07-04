/// <reference path="../../Blend.ts" />
/// <reference path="../Layout.ts" />


module Blend.layout.container {

    export class Layout extends Blend.layout.Layout {

        constructor(config: IContainerLayoutConfig) {
            var me = this;
            super(config);
            me.cssClassName = 'container';
        }


        render() {
            var me = this,
                containerViewEl: HTMLElement = super.render.apply(me, arguments),
                bodyContentElement: HTMLElement = <HTMLElement>me.view.getAttribute('bodyContentElement'),
                docFrag = document.createDocumentFragment();

            Blend.forEach((<Blend.ui.ContainerView>me.view).getChildren(), function(viewItem: Blend.ui.View) {
                var el: HTMLElement = viewItem.getElement();
                viewItem.setCssClass(<string>Blend.cssPrefix('layout-item'));
                docFrag.appendChild(el);
            });

            bodyContentElement.appendChild(docFrag);
            return containerViewEl;
        }

    }

    Blend.registerClassWithAlias('layout.container', Blend.layout.container.Layout);

}