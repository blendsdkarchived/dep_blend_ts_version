/// <reference path="View.ts"/>
/// <reference path="../dom/Dom.ts"/>
/// <reference path="../layout/Util.ts" />
/// <reference path="../layout/container/Layout.ts" />


module Blend.ui {

    export class ContainerView extends Blend.ui.View {

        protected initialConfig: IContainerViewConfig
        protected views: Array<View>;
        protected bodyElement: HTMLElement;
        protected bodyContentElement: HTMLElement;
        protected bodyPadding: number;
        protected layout: Blend.layout.container.Layout;

        constructor(config?: IContainerViewConfig) {
            var me = this;
            super(config);
            me.views = [];

            me.layoutTriggers = me.layoutTriggers.concat([
                'viewAdded',
                'viewRemoved'
            ]);

            // Add the Views by config
            Blend.forEach(me.initialConfig.views, function(childView: string|IViewConfig|Blend.ui.View, index: number) {
                me.addViewInternal(childView);
            });
        }

        /**
         * @override
         */
        protected initConfig(config?: IViewConfig) {
            var me = this,
                defaultConfig: IContainerViewConfig = {
                    boddyPadding: null,
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
        removeView(childView: number|View) {
            var me = this,
                index: number,
                spliced: Array<View> = [];
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
            }
        }

        notifyViewRemoved(childView: View) {
            var me = this;
            me.fireEvent('viewRemoved', childView);
        }


        /**
         * Adds a View to this container
         */
        addView(childView: string|IViewConfig|Blend.ui.View) {
            var me = this,
                view: View = me.addViewInternal.apply(me, arguments)
            me.layout.addView(view);
            me.notifyViewAdded(view);
        }

        notifyViewAdded(childView: View) {
            var me = this;
            me.fireEvent('viewAdded', childView);
        }

        private reIndexViews() {
            var me = this;
            Blend.forEach(me.views, function(view: View, index: number) {
                view.setAttribute('childIndex', index);
            });
        }

        private addViewInternal(childView: string|IViewConfig|Blend.ui.View) {
            var me = this,
                view: View,
                itemId: string;

            // Instantiate the View object
            if (Blend.isInstanceOf(childView, Blend.ui.View)) {
                view = <View>childView;
            } else if (Blend.isObject(childView)) {
                view = Blend.createObjectWithAlias(<IComponentConfig>childView);
            } else if (Blend.isString(childView)) {
                var config: IComponentConfig = {
                    ctype: <string>childView
                };
                view = Blend.createObjectWithAlias(config);
            }
            view.setAttribute('parent', me);
            view.setAttribute('childIndex', me.views.length || 0);
            me.views.push(view);
            return view;
        }


        /**
         * Retuns a list of child Views in this container. This function also accepts a filter
         * to help retuns a filtered list of child Views
         */
        getViews(filter?: (item: View, index: number) => boolean, filterScope?: any): Array<View> {
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
            Blend.LayoutUtil.fitElement(me.bodyElement);
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
        render(layoutConfig?: ICreateElement) {
            var me: ContainerView = this,
                spec = Blend.apply(layoutConfig || {}, {
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
         * Renders the body element and a boddy-inner element
         */
        protected renderBodyElement(): IDictionary {
            var me = this;
            return <IDictionary>{
                oid: 'bodyElement',
                cls: [Blend.cssPrefix('body')],
                style: {
                    padding: me.bodyPadding
                },
                children: [
                    {
                        cls: Blend.cssPrefix(['body-inner', 'fitted']),
                        oid: 'bodyContentElement',
                    }
                ]
            }
        }
    }
}