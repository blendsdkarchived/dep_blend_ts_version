/// <reference path="../../Blend" />
/// <reference path="../Layout" />
/// <reference path="../../interface/ContainerLayoutConfigInterface" />
/// <reference path="../../ui/ContainerView" />

module Blend.layout.container {

    export class Layout extends Blend.layout.Layout {

        private itemCssClassName: string
        protected isLayoutRendered: boolean

        constructor(config: ContainerLayoutConfigInterface) {
            var me = this;
            super(config);
            me.cssClassName = 'container';
            me.itemCssClassName = <string>Blend.cssPrefix('layout-item');
            me.isLayoutRendered = false;
        }

        /**
         * @override
         */
        performLayout() {
            var me = this;
            Blend.forEach(me.getVisibleViewItems(), function(view: Blend.ui.View) {
                view.placeInALayoutContext(true);
                view.performLayout();
                view.placeInALayoutContext(false);
            });
            super.performLayout();
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

        protected getVisibleViewItems() {
            var me = this;
            var filter = function(item: Blend.ui.View, index: number): boolean {
                return item.isVisible();
            }
            return (<Blend.ui.ContainerView>me.view).getViews(filter);
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
}