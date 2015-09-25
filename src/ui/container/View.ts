/// <reference path="../View.ts"/>
/// <reference path="../../dom/Dom.ts"/>
/// <reference path="../../layout/Util" />
/// <reference path="../../layout/container/Layout" />
/// <reference path="../../layout/ui/container/View" />

module Blend.ui.container {

    export class View extends Blend.ui.View {

        protected initialConfig: ContainerViewConfigInterface
        protected views: Array<Blend.ui.View>
        protected bodyElement: HTMLElement
        protected bodyContentElement: HTMLElement
        protected bodyPadding: number
        protected layout: Blend.layout.container.Layout
        protected allowScroll: eScroll

        protected innerLayout: Blend.layout.ui.container.View

        constructor(config?: ContainerViewConfigInterface) {
            var me = this;
            me.cssClass = Blend.cssPrefix('container');
            super(config);
            me.views = [];
            me.bodyPadding = me.initialConfig.bodyPadding;
            me.allowScroll = me.initialConfig.allowScroll;

            me.layoutTriggers = me.layoutTriggers.concat([
                'viewAdded',
                'viewRemoved'
            ]);

            me.pushViews(me.layout.createChildViews(me.initialConfig.views));
        }

        protected pushViews(views: Blend.ui.View|Array<Blend.ui.View>) {
            var me = this;
            me.views = me.views.concat(Blend.wrapInArray(views));
            me.reIndexViews();
        }

        /**
         * @override
         * @internal
         */
        initEventChain(parentView?: View) {
            var me = this;
            if (!me.mvcReady) {
                super.initEventChain(parentView);
                Blend.forEach(me.views, function(view: View) {
                    view.initEventChain(me);
                });
            }
        }

        /**
         * @override
         */
        protected initConfig(config?: ViewConfigInterface) {
            var me = this,
                defaultConfig: ContainerViewConfigInterface = {
                    bodyPadding: null,
                    allowScroll: eScroll.None,
                    views: [],
                    layout: {
                        ctype: 'container'
                    }
                }
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        /**
         * Removes a given View from this container and retuns it in case it needs to be used
         * in another place
         */
        removeView(childView: number|Blend.ui.View): Blend.ui.View {
            var me = this,
                index: number,
                spliced: Array<Blend.ui.View> = [];
            // Get the childView index
            if (Blend.isInstanceOf(childView, Blend.ui.View)) {
                index = (<View>childView).getAttribute<number>('childIndex');
            } else {
                index = <number>childView;
            }
            spliced = me.views.splice(index, 1);
            if (spliced.length === 1) {
                me.layout.removeView(spliced[0]);
                me.reIndexViews();
                me.notifyViewRemoved(spliced[0]);
                return spliced[0];
            } else {
                return null;
            }
        }

        notifyViewRemoved(childView: Blend.ui.View) {
            var me = this;
            me.fireEvent('viewRemoved', childView);
        }

        /**
         * Adds a View to this container
         */
        addView(childView: string|ViewConfigInterface|Blend.ui.View) {
            var me = this,
                views: Array<Blend.ui.View> = me.layout.createChildView(childView);
            me.pushViews(views);
            Blend.forEach(views, function(view: Blend.ui.View) {
                if (me.layout.addView(view)) {
                    me.notifyViewAdded(view);
                }
            });
        }

        notifyViewAdded(childView: Blend.ui.View) {
            var me = this;
            me.fireEvent('viewAdded', childView);
        }

        /**
         * Resets the child item indexes
         */
        private reIndexViews() {
            var me = this;
            Blend.forEach(me.views, function(view: Blend.ui.View, index: number) {
                view.setAttribute('childIndex', index);
            });
        }

        /**
         * Retuns a list of child Views in this container. This function also accepts a filter
         * to help retuns a filtered list of child Views
         */
        getViews(filter?: (item: Blend.ui.View, index: number) => boolean, filterScope?: any): Array<Blend.ui.View> {
            var me = this, filtered: Array<View> = [];
            if (filter) {
                Blend.forEach(me.views, function(child: View, idx: number) {
                    if (filter.apply(filterScope || me, [child, idx]) === true) {
                        filtered.push(child);
                    }
                });
                return filtered;
            } else {
                return this.views;
            }
        }

        /**
         * Destroys this View by setting the properties to null,
         * deleting them, destroying the child Views and removing its HTMLElement
         */
        destroy() {
            var me = this;
            Blend.forEach(me.views, function(view: View) {
                view.destroy();
            });
            super.destroy();
        }

        /**
         * Create and check the layout sub-system for this container View
         */
        protected createLayout(): Blend.layout.Layout {
            var me = this,
                layout = Blend.createLayout(me.initialConfig.layout, me);
            if (Blend.isInstanceOf(layout, Blend.layout.container.Layout)) {
                return layout;
            } else {
                throw new Error('Invalid layout type. The ContaineView or its derived classes need to have a Blend.layout.container.Layout or one of its drived classes as layout component.')
            }
        }

        /**
         * Option to be able to layout the inner elements of this container View
         * @internal
         */
        protected layoutInnerElements() {
            var me = this;
            if (!me.innerLayout) {
                me.innerLayout = me.createInnerLayout()
            }
            Blend.LayoutUtil.fitElement(me.bodyElement);
            me.innerLayout.performLayout();
        }

        protected createInnerLayout(): Blend.layout.ui.container.View {
            var me = this;
            return new Blend.layout.ui.container.View({
                viewElement: me.el,
                bodyElement: me.bodyElement,
                bodyContentElement: me.bodyContentElement,
                allowScroll: me.allowScroll
            });
        }

        /**
         * @override
         */
        protected layoutView() {
            var me = this;
            me.layoutInnerElements();
            super.layoutView.apply(me, arguments);
        }

        /**
         * @override
         */
        render(layoutConfig?: CreateElementInterface) {
            var me: Blend.ui.container.View = this,
                spec = Blend.apply(layoutConfig || {}, {
                    unselectable: true,
                    cls: Blend.cssPrefix('container', true),
                    children: [
                        me.renderBodyElement()
                    ]
                }, true, true);

            return me.createElement(spec, function(el: HTMLElement, oid: string) {
                me.setAttribute(oid, el);
            }, me);
        }

        /**
         * Renders the body element and a boddy-inner element.
         */
        protected renderBodyElement(): DictionaryInterface {
            /**
             * The bodyElement is mainly used to enable a padding in the content
             * The scollbars are set on th content element (body-inner)
             */
            var me = this;

            return <DictionaryInterface>{
                oid: 'bodyElement',
                unselectable: true,
                cls: Blend.cssPrefix('body'),
                style: {
                    padding: me.bodyPadding
                },
                children: [
                    {
                        cls: Blend.cssPrefix(['body-inner']),
                        oid: 'bodyContentElement',
                        unselectable: true,
                        'data-scroll': Blend.getEnumValue<string>(eScroll, me.allowScroll).toLowerCase()
                    }
                ]
            }
        }
    }
}