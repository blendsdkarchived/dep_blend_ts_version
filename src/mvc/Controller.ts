/// <reference path="../Blend.ts" />
/// <reference path="View.ts" />
/// <reference path="Context.ts" />

interface ControllerEventHandler {
    (view: Blend.mvc.View, ...args: any[]): void;
}

module Blend.mvc {

    /**
     * Base class for a Controller. When creating a new controller, it must have an unique id
     * that is going to be registered in the MV content.
     */
    export class Controller {

        private references: IDictionary = {};
        private handlers: IDictionary = {};

        protected id:string;

        constructor(uniqueId:string) {
            var me = this;
            me.id = uniqueId;
            if(!Blend.isNullOrUndef(me.id)) {
                Blend.mvc.Context.registerController(me.id, me);
            } else {
                throw new Error('A controller needs to have a unique ID. Did you forget to set the [id] property?')
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
            if (!this.handlers[eventPath]) {
                this.handlers[eventPath] = [handler];
            } else {
                this.handlers[eventPath].push(handler);
            }
        }

        /**
         * @internal
         * Registers a View's reference within this controller
         */
        registerView(view: View): void {
            var refId = view.getReference();
            if (!this.references[refId]) {
                this.references[refId] = [view];
            } else {
                this.references[refId].push(view);
            }
        }
    }
}