module Blend {
    export module mvc {

        export interface IBinding {
            [field: string]: string;
        }

        export interface IBindingClientConfig {
            bindings?: IBinding;
        }

        export class BindingClient extends Blend.BaseClass implements IBindingClientConfig {

            bindings: IBinding;

            constructor(config?: IBindingClientConfig) {
                super(config);
                this.processBindings();
            }

            processBindings(): void {
                var me = this,
                    modelName,
                    fieldName,
                    model,
                    setterName,
                    value: Array<string>;
                if (me.bindings) {
                    for (var key in this.bindings) {
                        value = me.bindings[key].toString().split('.');
                        if (value.length == 2) {
                            setterName = 'set' + Blend.ucFirst(key);
                            if (me[setterName]) {
                                modelName = value[0];
                                fieldName = value[1];
                                model = Blend.mvc.Context.getModel(modelName);
                                if (model) {
                                    var createCallback = function(name) {
                                        return function() {
                                            me[name].apply(me, arguments);
                                        }
                                    }
                                    model.bind(fieldName, createCallback(setterName));
                                } else {
                                    throw Error(`Model ${modelName} does not exist!`);
                                }
                            } else {
                                throw new Error(`Unable to create binding. No setter found for ${key} (${setterName})`);
                            }
                            // check to see if we have a setter with the set"key"
                        } else {
                            throw new Error("Invalid binding key. Syntax must be [model].[field]");
                        }
                    }
                }
            }
        }
    }
}