/// <reference path="../Layout" />
/// <reference path="../../ui/Container" />
/// <reference path="../../interface/ContainerLayoutConfigInterface" />


module Blend.layout.container {

    export class Layout extends Blend.layout.Layout {

        protected initialConfig: ContainerLayoutConfigInterface;
        protected view: Blend.ui.Container;
        protected childViews: Array<Blend.ui.View>;
        protected layoutCssClass: string;
        protected layoutItemCssClass: string;
        protected bodyElement: HTMLElement;

        constructor(config: ContainerLayoutConfigInterface) {
            var me = this;
            super(config);
            me.childViews = [];
            me.layoutItemCssClass = <string>Blend.cssPrefix(me.layoutCssClass + '-layout-item');
            me.addChildViews(me.initialConfig.views);
        }

        protected addChildViews(childViews: Array<Blend.ui.View>) {
            var me = this;
            Blend.forEach(childViews || [], function(childView: Blend.ui.View) {
                if (childView.isVisible()) {
                    me.addChildView(childView);
                }
            });
        }

        protected addChildView(childView: Blend.ui.View) {
            var me = this;
            me.childViews.push(childView);
        }

        /**
         * @override
         */
        performLayout() {
            var me = this;
            Blend.forEach(me.childViews, function(view: Blend.ui.View) {
                view.placeInALayoutContext(true);
                view.performLayout();
                view.placeInALayoutContext(false);
            });
            super.performLayout();
        }

        protected renderChilViews() {
            var me = this, el: HTMLElement,
                result: Array<HTMLElement> = [];
            Blend.forEach(me.childViews, function(childView: Blend.ui.View) {
                el = childView.getElement();
                Blend.Dom.cssClass(el, me.layoutItemCssClass);
                result.push(el);
            });
            return result;
        }

        render(): HTMLElement {
            var me = this,
                spec: CreateElementInterface = {
                    children: [
                        <CreateElementInterface>{
                            oid: 'bodyElement',
                            cls: Blend.cssPrefix([me.layoutCssClass + '-layout', 'fitted']),
                            children: me.renderChilViews()
                        }
                    ]
                }
            return super.render(spec);
        }

    }
}