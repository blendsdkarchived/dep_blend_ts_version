/// <reference path="../../Blend.ts" />
/// <reference path="../Layout.ts" />


module Blend.layout.container {

    export class Layout extends Blend.layout.Layout {

        protected isLayoutRendered: boolean;

        private itemCssClassName: string;


        constructor(config: IContainerLayoutConfig) {
            var me = this;
            super(config);
            me.itemCssClassName = <string>Blend.cssPrefix('layout-item');
            me.cssClassName = 'container';
            me.isLayoutRendered = false;
        }

        /**
         * Gets the body content element of a contrainer
         * @internal
         */
        getViewBodyContentElement() {
            var me = this;
            return <HTMLElement>me.view.getAttribute('bodyContentElement');
        }

        /**
         * Removes the HTMLElement of a View from the ContainerView
         */
        removeView(view: Blend.ui.View) {
            var me = this;
            if (me.isViewRendered) {
                var el: HTMLElement = view.getElement();
                return Blend.Dom.removeElement(el);
            }
        }

        /**
         * Adds a View to this container Layout
         */
        addView(view: Blend.ui.View) {
            var me = this;
            if (me.isLayoutRendered) {
                var el: HTMLElement = view.getElement()
                view.setCssClass(me.itemCssClassName);
                me.getViewBodyContentElement().appendChild(el);
                me.view.invalidateLayout();
                me.view.performLayout();
            }
        }

        /**
         * @override
         */
        render() {
            var me = this,
                containerViewEl: HTMLElement = super.render.apply(me, arguments),
                bodyContentElement: HTMLElement = me.getViewBodyContentElement(),
                docFrag = document.createDocumentFragment();

            Blend.forEach((<Blend.ui.ContainerView>me.view).getViews(), function(viewItem: Blend.ui.View) {
                var el: HTMLElement = viewItem.getElement();
                viewItem.setCssClass(me.itemCssClassName);
                docFrag.appendChild(el);
            });

            bodyContentElement.appendChild(docFrag);
            me.isLayoutRendered = true;
            return containerViewEl;
        }

    }

    Blend.registerClassWithAlias('layout.container', Blend.layout.container.Layout);

}