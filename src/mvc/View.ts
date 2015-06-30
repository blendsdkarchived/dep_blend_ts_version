/// <reference path="../Component" />
/// <reference path="../ComponentInterfaces.ts" />
/// <reference path="Model.ts" />
/// <reference path="Context.ts" />

module Blend.mvc {

    export class View extends Component {

        private reference: string;
        private bindings: IStringDictionary;

        constructor(config?: IViewConfig) {
            var me = this;
            super();
            config = config || {};
            me.processBindings(config.bindings || {});
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
                    me.bindProperty(modelFieldPath,'set' + Blend.ucFirst(propertyName))
                });
            }
        }
    }
}