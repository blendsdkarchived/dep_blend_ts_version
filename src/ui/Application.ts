///<reference path="View.ts"/>
///<reference path="../Blend.ts"/>
///<reference path="../mvc/Context.ts"/>
///<reference path="../Environment.ts"/>
///<reference path="../utils/Dom.ts"/>
///<reference path="../layout/FitUtil.ts"/>

module Blend {
    export module ui {

        export interface IApplicationConfig extends IViewConfig {
            /**
             * The main view for this application
             */
            mainView: (Blend.ui.View|IClassWithAliasConfig);
        }

        export class Application extends Blend.ui.View implements IApplicationConfig {

            mainView: Blend.ui.View;

            private _resizing: boolean;

            constructor(config?: IApplicationConfig) {
                var me = this;
                me.bindToAllControllers();
                config.layoutConfig = null;
                config.reference = "application";
                super(config);
                (<Blend.ui.View>me.mainView).parent = me;
            }

            parseConfigValue(key: string, value: any) {
                var me = this;
                if (key === 'mainView') {
                    if (Blend.isInstanceOf(value, Blend.ui.View)) {
                        return value;
                    } else {
                        value.parent = me;
                        return Blend.createObjectWithAlias(Blend.getAlias(value), value);
                    }
                } else {
                    return value;
                }
            }

            protected asyncRun() {
                var me = this,
                    body = document.body;
                Blend.Dom.clearElement(body);
                body.appendChild(me.getElement());
                me.setupWindowListeners();
                me.performLayout();
                me.notifyReady();
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
                var me = this,
                    ctrlNames = [];
                Blend.forEach(Blend.mvc.Context.controllers, function(val, name) {
                    ctrlNames.push(name);
                });
                this.controllers = ctrlNames;
            }

            onWindowResize() {
                var me = this;
                if (!me._resizing) {
                    me._resizing = true;
                    me.performLayout();
                    me.notifyResize.apply(me, arguments);
                    me._resizing = false;
                }
            }

            setupWindowListeners() {
                var me = this, tm = -1;
                Blend.Environment.addEventListener(window, 'resize', function(evt) {
                    clearTimeout(tm);
                    tm = setTimeout(function() {
                        me.onWindowResize.apply(me, [evt]);
                    }, 1);
                });
            }

            notifyReady() {
                var me = this;
                me.fireEvent('ready');
            }

            notifyResize(evt) {
                var me = this;
                me.fireEvent('resize', evt);
            }

            /**
             * Render the application HTMLElement fitted inside the document body
             * element and the MainView fitted inside the application's element
             */
            render(): HTMLElement {
                var me = this,
                    isResizing = false,
                    el = Blend.Dom.createElement({
                        cls: [Blend.cssPrefix('application')],
                        extra: {
                            'data-layout': 'fitted'
                        }
                    });
                if (me.mainView) {
                    el.appendChild(me.mainView.getElement());
                    Blend.layout.utils.fitUtil(me.mainView.getElement());
                }
                return el;
            }

            run() {
                var me = this;
                Blend.Environment.ready(me.asyncRun, me);
                Blend.Environment.kickStart();
            }
        }
    }
}