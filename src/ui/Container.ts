/// <reference path="../Blend" />
/// <reference path="View" />
/// <reference path="../layout/container/Layout" />
/// <reference path="../interface/ContainerConfigInterface" />

module Blend.ui {

    export class Container extends Blend.ui.View {

        protected initialConfig: ContainerConfigInterface
        protected views: Array<Blend.ui.View>
        protected layout: Blend.layout.container.Layout;

        constructor(config?: ContainerConfigInterface) {
            var me = this;
            me.views = [];
            super(config);
            me.cssClass = Blend.cssPrefix('container');
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

        getViews(): Array<Blend.ui.View> {
            return this.views;
        }

        /**
         * Creates a list if Blend.ui.Views
         */
        createChildViews(childViews: Array<Blend.ui.View|ComponentConfigInterface|string>) {
            var me = this,
                views: Array<Blend.ui.View> = [];
            Blend.forEach(childViews, function(childView: Blend.ui.View|ComponentConfigInterface|string) {
                me.views.push(me.createChildView(childView));
            });
        }

        /**
         * Creates a child View instance and returns it wrapped in an Array. This is done
         * this way because a container layout may be injecting object views inside the container
         * view hierarchy
         */
        createChildView(childView: Blend.ui.View|ComponentConfigInterface|string): Blend.ui.View {
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
            }
            view.setAttribute('parent', me);
            return view;
        }

        protected createLayout(): Blend.layout.Layout {
            var me = this;
            me.createChildViews(me.initialConfig.views || []);
            return me.createContentLayout();
        }

        private createContentLayout(): Blend.layout.container.Layout {

            var me = this, lconfig: any;
            lconfig = me.initialConfig.layout;

            if (Blend.isString(lconfig)) {
                lconfig = {
                    ctype: 'layout.' + me.initialConfig.layout,
                    views: me.views,
                    view: me
                }
            } else if (Blend.isObject(lconfig)) {
                lconfig.ctype = 'layout.' + lconfig.ctype;
                lconfig.views = me.views
                lconfig.view = me;
            }

            if (Blend.isObject(lconfig)) {
                return Blend.createObjectWithAlias(lconfig);
            } else {
                throw Error('Invalid or missing layout configuration for this Container!');
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

        protected initConfig(config?: ContainerConfigInterface) {

            var defaultConfig: ContainerConfigInterface = {
                allowScroll: eScroll.None,
                bodyPadding: 0,
                views: [],
                layout: null
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

    }

}