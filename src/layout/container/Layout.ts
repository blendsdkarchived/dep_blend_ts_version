/// <reference path="../../Blend" />
/// <reference path="../Layout" />
/// <reference path="../../interface/ContainerLayoutConfigInterface" />
/// <reference path="../../ui/container/View" />

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
         * Creates a list if Blend.ui.Views based
         */
        createChildViews(childViews: Array<Blend.ui.View|ComponentConfigInterface|string>) : Array<Blend.ui.View> {
            var me = this,
                views: Array<Blend.ui.View> = [];
            Blend.forEach(childViews, function(childView: Blend.ui.View|ComponentConfigInterface|string) {
                views = views.concat(me.createChildView(childView));
            });
            return views;
        }

        /**
         * Creates a child View instance and returns it wrapped in an Array. This is done
         * this way because a container layout may be injecting object views inside the container
         * view hierarchy
         */
        createChildView(childView: Blend.ui.View|ComponentConfigInterface|string): Array<Blend.ui.View> {
            var me = this,
                view: Blend.ui.View

            // Instantiate the View object
            if (Blend.isInstanceOf(childView, Blend.ui.View)) {
                view = <Blend.ui.View>childView;
            } else if (Blend.isObject(childView)) {
                view = Blend.createObjectWithAlias(<ComponentConfigInterface>childView);
            } else if (Blend.isString(childView)) {
                var config: ComponentConfigInterface = {
                    ctype: <string>childView
                };
                view = Blend.createObjectWithAlias(config);
                view.setAttribute('parent',me.view);
            }
            return [view];
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
            return me.isLayoutRendered;
        }

        protected getVisibleViewItems() {
            var me = this;
            var filter = function(item: Blend.ui.View, index: number): boolean {
                return item.isVisible();
            }
            return (<Blend.ui.container.View>me.view).getViews(filter);
        }

        /**
         * @override
         */
        render() {
            var me = this,
                containerViewEl: HTMLElement = super.render.apply(me, arguments),
                bodyContentElement: HTMLElement = me.getViewBodyContentElement(),
                docFrag = document.createDocumentFragment();

            Blend.forEach((<Blend.ui.container.View>me.view).getViews(), function(viewItem: Blend.ui.View) {
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