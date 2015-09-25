/// <reference path="Blend" />
/// <reference path="ui/View" />
/// <reference path="layout/Application/" />
/// <reference path="interface/ApplicationConfigInterface" />
/// <reference path="interface/ContainerViewConfigInterface" />

module Blend {

    /**
     * Common base class for both web-desktop and touch applicatioins
     */
    export class Application extends Blend.ui.View {

        private isStarted: boolean

        protected isResizing: boolean
        protected initialConfig: ApplicationConfigInterface
        protected mainView: Blend.ui.View

        constructor(config?: ApplicationConfigInterface) {
            var me = this;
            super(config);
            me.bindToAllControllers();
            me.createMainView();
            me.isStarted = false;
            me.cssClass = Blend.cssPrefix('application');
        }

        /**
         * Retuns a reference to the main view of this application
         */
        getMainView(): Blend.ui.View {
            return this.mainView;
        }

        protected createLayout(): Blend.layout.Layout {
            return new Blend.layout.Application({ view: this });
        }

        protected initConfig(config?: ApplicationConfigInterface) {
            var me = this,
                defaultConfig: ContainerViewConfigInterface = {
                    theme: 'default'
                },
                config: ApplicationConfigInterface = Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);

            config.reference = 'application';
            return config;
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            Blend.Dom.cssClass(document.body, me.initialConfig.theme);
        }

        /**
         * Bind the Application view to all available controllers
         */
        protected bindToAllControllers(): void {
            var me = this;
            Blend.forEach(Blend.mvc.Context.getControllers(), function(controller: Blend.mvc.Controller) {
                me.addController(controller)
            });
        }

        /**
         * Created the main view of this application
         */
        protected createMainView() {
            var me = this,
                mv = me.initialConfig.mainView;
            if (mv) {
                if (Blend.isString(mv)) {
                    me.mainView = Blend.createObjectWithAlias({ ctype: <string>mv });
                } else if (Blend.isInstanceOf(mv, Blend.ui.View)) {
                    me.mainView = <Blend.ui.View>mv;
                } else if (Blend.isObject(mv)) {
                    me.mainView = Blend.createObjectWithAlias(<ComponentConfigInterface>mv);
                }
            } else {
                throw new Error('Missing mainView configuration for this application!');
            }
            if (me.mainView) {
                me.mainView.initEventChain(me);
            }
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
            var me = this, tm = -1,
                counts = 0,
                curSize = -1;
            Blend.Environment.addEventListener(window, 'resize', function(evt: Event) {
                curSize = window.innerWidth + window.innerHeight;
                clearInterval(tm);
                tm = setInterval(function() {
                    if (counts >= 3) {
                        if (curSize === (window.innerWidth + innerHeight)) {
                            clearInterval(tm);
                            me.onWindowResize.apply(me, [evt]);
                        } else {
                            counts = 0;
                        }
                    } else {
                        counts++;
                    }
                }, 50);
            });
        }

        protected asyncRun() {
            var me = this,
                body = document.body;
            if (!me.isStarted) {
                Blend.Dom.clearElement(body);
                body.appendChild(me.getElement());
                me.setupWindowListeners();
                me.performLayout();
                me.notifyApplicationReady();
                me.isStarted = true;
            }
        }

        /**
         * Fires then the application is ready for user interaction
         */
        protected notifyApplicationReady() {
            var me = this;
            me.fireEvent('applicationReady');
        }

        /**
         * Entry point of a Blend application
         */
        run() {
            var me = this;
            Blend.Environment.ready(function() {
                me.asyncRun.apply(me, arguments);
            }, me);
            Blend.Environment.kickStart();
        }


    }

}