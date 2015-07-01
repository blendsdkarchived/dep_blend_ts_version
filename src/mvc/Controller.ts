/// <reference path="../Blend.ts" />
/// <reference path="View.ts" />
/// <reference path="Context.ts" />

interface ControllerEventHandler {
    (view: Blend.mvc.View, ...args: any[]): void;
}

module Blend.mvc {

    /**
     * Base class for a Controller. When creating a new controller, if you
     * provide a globalId to the constructor the the Controller is going
     * to be registers in the global Blend.mvc.Context and it can be used
     * from Views that are not in the same View hierarchy.
     */
    export class Controller {

        private references: IDictionary = {};
        private handlers: IDictionary = {};

        constructor(globalId?:string) {
            var me = this;
            if(!Blend.isNullOrUndef(globalId)) {
                Blend.mvc.Context.registerController(globalId, me);
            }
        }

        /**
         * @internal
         * Delegates an event to the regisreted handlers in this controller
         */
        delegate(eventPath: string, view: View, args: any[]) {
            var me = this;
            if (this.handlers[eventPath]) {
                var handlers = this.handlers[eventPath];
                handlers.forEach(function(handler: ControllerEventHandler) {
                    handler.apply(me, [view].concat(args));
                });
            }
        }

        /**
         * Registers an event handler within this controller
         */
        protected on(eventPath: string, handler: ControllerEventHandler): void {
            var me = this;
            if (!me.handlers[eventPath]) {
                me.handlers[eventPath] = [handler];
            } else {
                me.handlers[eventPath].push(handler);
            }
        }

        /**
         * @internal
         * Registers a View's reference within this controller
         */
        bindView(view: View): void {
            var refId = view.getReference();
            if (!this.references[refId]) {
                this.references[refId] = [view];
            } else {
                this.references[refId].push(view);
            }
        }
    }
}