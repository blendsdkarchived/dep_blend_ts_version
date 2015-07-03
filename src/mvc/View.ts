/// <reference path="../Component" />
/// <reference path="../ComponentInterfaces.ts" />
/// <reference path="Model.ts" />
/// <reference path="Context.ts" />

module Blend.mvc {

    export class View extends Component {

        protected reference: string;
        protected parent: View;
        protected initialConfig:IViewConfig;


        private bindings: IStringDictionary;
        private mvcReady: boolean;
        private controllers: Array<string|Controller>;
        private _controlerId: number;

        constructor(config?: IViewConfig) {
            var me = this
            super(config);
            me.mvcReady = false;
            // copy or merge the controller list form config or pre existing list of me.controllers
            me.controllers = [];
            me.reference = me.initialConfig.reference
            me.addControllers([].concat(me.controllers, me.initialConfig.controllers));
            me.processBindings(me.initialConfig.bindings);
        }

        /**
         * Initialises the provided config from the constructor
         * before using it in the View.
         */
        protected initConfig(config: IViewConfig): IViewConfig {
            var defaultConfig: IViewConfig = {
                reference: null,
                bindings: {},
                controllers: []
            }
            return Blend.apply(defaultConfig,super.initConfig(config),true,false);
        }

        /**
         * Helper function to add a list of controllers to this View.
         * This method only works before any events are fired by this View
         */
        protected addControllers(controllers: Array<string|Controller>) {
            var me = this;
            if (!me.mvcReady) {
                Blend.forEach(controllers, function(item: string|Controller) {
                    me.addController(item);
                });
            }
        }

        /**
         * Helper function to add a controller to this View.
         * This method only works before any events are fired by this View
         */
        protected addController(controller: string|Controller) {
            var me = this, id: string;
            if (!me.mvcReady) {
                if (Blend.isString(controller)) {
                    // get the Controller from the global context
                    me.controllers.push(me.getController(<string>controller));
                } else if (Blend.isInstanceOf(controller, Blend.mvc.Controller)) {
                    me.controllers.push(<Controller>controller);
                }
            }
        }

        /**
         * Helper function to add a Controller to this view
         */
        protected getController(name: string): Controller {
            return Blend.mvc.Context.getController(<string>name);
        }

        /**
         * Creates a wrapper function that executes the controller.delegate.
         */
        private createDelegateCall(controller: Controller, eventName: String, args: any) {
            var me = this;
            return function() {
                controller.delegate(me.reference + '.' + eventName, me, args);
            }
        }

        /**
         * Fires an event towards the Controllers within this View
         */
        protected fireEvent(eventName: string, ...args: any[]) {
            var me = this,
                controller: Controller;
            if (!me.mvcReady) {
                me.resolveControllers();
                me.bindToControllers();
                me.mvcReady = true;
            }
            if (me.controllers) {
                Blend.forEach(me.controllers, function(controllerItem: Controller|string, id: string) {
                    if (Blend.isString(controllerItem)) {
                        controller = me.getController(<string>controllerItem);
                    } else {
                        controller = <Controller>controllerItem;
                    }
                    setTimeout(me.createDelegateCall(controller, eventName, args), 2);
                });
            }
        }


        /**
         * Bind this View to the assigned controllers if possible. A View can
         * only be binded to a Controller if it has a valid reference
         */
        private bindToControllers() {
            var me = this;
            if (me.hasControllers()) {
                var controller: Controller;
                if (me.reference) {
                    Blend.forEach(me.controllers, function(item: Controller|string) {
                        if (Blend.isString(item)) {
                            // controller is a string so it must be a global controller
                            controller = me.getController(<string>item);
                        } else {
                            // controller is an instantiated Controller object
                            controller = <Controller>item;
                        }
                        if (controller) {
                            // So the controller is valid and if we have a reference then we register
                            // this View
                            controller.bindView(me);
                        } else {
                            throw new Error(`Controler by id ${item} was not found!`);
                        }
                    });
                }
            }
        }

        /**
         * This function will try to find any Controllers within the parent View chain
         * if this View has a reference but no Controllers assigned to it.
         */
        private resolveControllers(): void {
            var me = this;
            if (me.reference) {
                // Case of having a reference but self not having a controller,
                // so we travel up until we find a parent with controllers
                if (!me.hasControllers()) {
                    var view: View = me.parent,
                        parent: View,
                        search: boolean = true;
                    while (search && view) {
                        if (view.hasControllers()) {
                            me.controllers = view.controllers;
                            search = false;
                        } else {
                            view = view.parent;
                        }
                    }
                }
            }
        }

        /**
         * Provides information if the View has any Controllers.
         */
        public hasControllers(): boolean {
            var me = this;
            return (me.controllers && me.controllers.length !== 0);
        }

        /**
         * Retrives the refenece key of this View
         */
        public getReference() {
            var me = this;
            return me.reference;
        }

        /**
         * Retrives a model to be used in the property binding.
         * This function will look for the requested Model in the
         * {Blend.mvc.Context} but can be overridden to return
         * an internal model that is privide to this view.
         *
         * If you override this function then make sure you pass
         * the call to the super.getModel if the conditions to
         * find your private Moel is not set.
         */
        protected getModel(modelName: string) {
            return Blend.mvc.Context.getModel(modelName);
        }

        /**
         * Binds a field in a Model to a setter function in this View
         */
        protected bindProperty(modelFieldPath: string, setterFunctionName: string) {
            var me = this,
                modelName: string,
                fieldName: string,
                model: Model,
                path: string[] = modelFieldPath.split('.');

            if (path.length === 2) {
                if (me.hasFunction(setterFunctionName)) {
                    modelName = path[0];
                    fieldName = path[1];
                    model = me.getModel(modelName);
                    if (model) {
                        var createCallback = function(name: string) {
                            return function() {
                                me.applyFunction(name, arguments);
                            }
                        }
                        model.bind(fieldName, createCallback(setterFunctionName));
                    } else {
                        throw Error(`Model ${modelName} does not exist!`);
                    }
                } else {
                    throw new Error(`Unable to create binding. ${setterFunctionName} does not exist.`);
                }
            } else {
                throw new Error("Invalid binding path. Syntax must be [model].[field]");
            }
        }

        /**
         * Processes the model bindings
         */
        private processBindings(bindings: IStringDictionary): void {
            var me = this;
            if (bindings) {
                Blend.forEach(bindings, function(modelFieldPath: string, propertyName: string) {
                    me.bindProperty(modelFieldPath, 'set' + Blend.ucFirst(propertyName))
                });
            }
        }
    }
}