/// <reference path="../Blend.ts" />
/// <reference path="../ui/View.ts" />
/// <reference path="../ComponentInterfaces.ts" />
/// <reference path="../layout/Layout.ts" />




module Blend.web {

    export class Application extends Blend.ui.View {

        protected isResizing: boolean;
        protected initialConfig: IWebApplicationConfig;
        protected mainView: Blend.ui.View;

        constructor(config?: IWebApplicationConfig) {
            var me = this;
            super(config);
            me.isResizing = false;
            me.bindToAllControllers();
            me.createMainView();
            me.layoutTriggers = me.layoutTriggers.concat([
                'applicationResized'
            ]);
        }

        protected createMainView() {
            var me = this,
                mv = me.initialConfig.mainView;
            if (mv) {
                if (Blend.isString(mv)) {
                    me.mainView = Blend.createObjectWithAlias({ ctype: <string>mv });
                } else if (Blend.isInstanceOf(mv, Blend.ui.View)) {
                    me.mainView = <Blend.ui.View>mv;
                } else if (Blend.isObject(mv)) {
                    me.mainView = Blend.createObjectWithAlias(<IComponentConfig>mv);
                }
            }
            if (me.mainView) {
                me.mainView.setAttribute('parent', me);
            }
        }

        protected initConfig(config?: IWebApplicationConfig) {
            var me = this,
                defaultConfig: IContainerViewConfig = {
                },
                config: IWebApplicationConfig = Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);

            // Force application layout
            config.layout = {
                ctype: 'application',
            }
            config.reference = 'application';
            return config;
        }

        render(): HTMLElement {
            var me = this,
                el = me.createElement({
                    cls: <string[]>Blend.cssPrefix(['application', 'fitted'], true)
                });

            if (me.mainView) {
                el.appendChild(me.mainView.getElement());
                Blend.LayoutUtil.fitElement(me.mainView.getElement());
            }

            return el;
        }

        layoutView() {
            var me = this;
            if (me.mainView) {
                me.mainView.performLayout.apply(me.mainView, arguments);
            }
        }

        /**
         * Bind the Application view to all available controllers
         */
        bindToAllControllers(): void {
            var me = this;
            Blend.forEach(Blend.mvc.Context.getControllers(), function(controller: Blend.mvc.Controller) {
                me.addController(controller)
            });
        }

        notifyApplicationResized(evt: Event) {
            var me = this;
            me.fireEvent('applicationResized', evt);
        }


        protected onWindowResize() {
            var me = this;
            if (!me.isResizing) {
                me.isResizing = true;
                me.performLayout();
                me.notifyApplicationResized.apply(me, arguments);
                me.isResizing = false;
            }
        }

        protected setupWindowListeners() {
            var me = this, tm = -1;
            Blend.Environment.addEventListener(window, 'resize', function(evt: Event) {
                clearTimeout(tm);
                tm = setTimeout(function() {
                    me.onWindowResize.apply(me, [evt]);
                }, 1);
            });
        }

        notifyApplicationReady() {
            var me = this;
            me.fireEvent('applicationReady');
        }

        protected asyncRun() {
            var me = this,
                body = document.body;
            Blend.Dom.clearElement(body);
            body.appendChild(me.getElement());
            me.setupWindowListeners();
            me.performLayout();
            me.notifyApplicationReady();
        }


        /**
         * Entry point of a Blend application
         */
        run() {
            var me = this;
            Blend.Environment.ready(me.asyncRun, me);
            Blend.Environment.kickStart();
        }

    }

}