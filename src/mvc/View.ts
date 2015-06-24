/// <reference path="../Blend.ts"/>
/// <reference path="../Environment.ts"/>
/// <reference path="BindingClient.ts"/>
/// <reference path="Controller.ts"/>
module Blend.mvc {

    export interface IViewConfig extends Blend.mvc.IBindingClientConfig {
        reference?: string;
        controllers?: Array<string|Controller>;
    }

    export class View extends Blend.mvc.BindingClient implements IViewConfig {

        parent: View;
        reference: string;
        controllers: Array<string|Controller>;
        bindings: Blend.mvc.IBinding;
        private mvcReady: boolean;

        constructor(config?: IViewConfig) {
            var me = this;
            super(config);
            me.mvcReady = false;
            me.processBindings();
        }

        fireEvent(eventName: string, ...args: any[]) {
            var me = this,
                controller: Controller;
            if (!me.mvcReady) {
                me.registerControllers();
                me.mvcReady = true;
            }
            if (me.controllers) {
                me.controllers.forEach(function(item) {
                    if (Blend.isString(item)) {
                        controller = <Controller>Blend.mvc.Context.getController(<string>item);
                    } else {
                        controller = <Controller>item;
                    }
                    setTimeout(function() {
                        controller.delegate(me.reference + '.' + eventName, me, args);
                    }, 2);
                });
            }
        }

        registerControllers(): void {
            var me = this;
            // an empty array is the same as having no controllers!
            if (me.controllers && me.controllers.length == 0) {
                me.controllers = null;
            }
            if (me.reference) {
                // has a reference but no controllers.
                // so we travel up until we find a parent with controllers
                if (!me.controllers) {
                    var view = me.parent, parent, search = true;
                    while (search && view) {
                        if (view.hasControllers()) {
                            me.controllers = view.controllers;
                            search = false;
                        } else {
                            view = view.parent;
                        }
                    }
                    /*
                    while (!Blend.isNullOrUndef(parent = view.parent)) {
                        if (parent.hasControllers()) {
                            this.controllers = parent.controllers;
                            break;
                        } else {
                            view = parent;
                        }
                    }
                    */
                }
            }
            // check if we have valid controllers
            if (me.controllers) {
                var controller: Controller;
                me.controllers.forEach(function(item, index) {
                    if (Blend.isString(item)) {
                        controller = <Controller>Blend.mvc.Context.getController(<string>item);
                    } else {
                        controller = <Controller>item;
                    }
                    if (controller) {
                        if (me.reference) {
                            controller.registerView(me);
                        }
                    } else {
                        throw new Error(`Controler by id ${item} was not found!`);
                    }
                });
            }
        }

        hasControllers(): boolean {
            return (this.controllers && this.controllers.length !== 0);
        }
    }
}