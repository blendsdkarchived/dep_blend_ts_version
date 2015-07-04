/// <reference path="View.ts"/>
/// <reference path="../dom/Dom.ts"/>
/// <reference path="../layout/Util.ts" />
/// <reference path="../layout/container/Layout.ts" />


module Blend.ui {

    export class ContainerView extends Blend.ui.View {

        protected initialConfig: IContainerViewConfig
        protected children: Array<View>;
        protected bodyElement: HTMLElement;
        protected bodyContentElement: HTMLElement;
        protected bodyPadding: number;

        constructor(config?: IContainerViewConfig) {
            var me = this;
            super(config);
            me.children = [];

            me.layoutTriggers = me.layoutTriggers.concat([
                'childAdded'
            ]);

            // Add the children by config
            me.suspendLayout(); me.dispableEvents();
            me.addChildren(me.initialConfig.children);
            me.resumeLayout(); me.enableEvents();
        }

        protected createLayout(): Blend.layout.Layout {
            var me = this,
                layout = Blend.createLayout(me.initialConfig.layout, me);
            if (Blend.isInstanceOf(layout, Blend.layout.container.Layout)) {
                return layout;
            } else {
                throw new Error('Invalid layout type. The ContaineView or its derived classes need to have a Blend.layout.container.Layout or one of its drived classes as layout component.')
            }
        }

        protected initConfig(config?: IViewConfig) {
            var me = this,
                defaultConfig: IContainerViewConfig = {
                    boddyPadding: null,
                    children: [],
                    layout: {
                        ctype: 'container'
                    }
                }
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        getChildren(filter?: (item: View, index: number) => boolean, filterScope?: any): Array<View> {
            var me = this, filtered: Array<View> = [];
            if (filter) {
                Blend.forEach(me.children, function(child: View, idx: number) {
                    if (filter.apply(filterScope || me, [child, idx]) === true) {
                        filtered.push(child);
                    }
                });
                return filtered;
            } else {
                return this.children;
            }
        }

        addChildren(children: Array<string|IViewConfig|Blend.ui.View>) {
            var me = this;
            Blend.forEach(children, function(child: string|IViewConfig|Blend.ui.View) {
                me.addChild(child);
            });
        }

        addChild(childView: string|IViewConfig|Blend.ui.View) {
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

            me.children.push(view);
            me.notifyChildAdded(view);
        }

        notifyChildAdded(childView: View) {
            var me = this;
            me.fireEvent('childAdded', childView);
        }

        protected layoutInnerElements() {
            var me = this;
            Blend.LayoutUtil.fitElement(me.bodyElement);
        }

        protected layoutView() {
            var me = this;
            me.layoutInnerElements();
            super.layoutView.apply(me, arguments);
        }


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