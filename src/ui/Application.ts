///<reference path="View.ts"/>
///<reference path="../Blend.ts"/>
///<reference path="../mvc/Context.ts"/>
///<reference path="../Environment.ts"/>
///<reference path="../utils/Dom.ts"/>

module Blend {
    export module ui {
        export interface IApplicationConfig extends IViewConfig {
            mainView: Blend.ui.View;
        }

        export class Application extends Blend.ui.View implements IApplicationConfig {

            mainView: Blend.ui.View;

            private _resizing: boolean;

            constructor(config?: IApplicationConfig) {
                var me = this;
                me.bindToAllControllers();
                config.reference = "application";
                super(config);
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

            render(): HTMLElement {
                var me = this,
                    isResizing = false;;
                return Blend.Dom.createElement({
                    cls: [Blend.cssPrefix('application')],
                    extra: {
                        'data-layout':'center',
                        id:'b1'
                    },
                    style: {
                        width:200,
                        height:200,
                        'background-color':'red'
                    }
                });
            }

            run() {
                var me = this;
                Blend.Environment.ready(me.asyncRun, me);
                Blend.Environment.kickStart();
            }
        }
    }
}