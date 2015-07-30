/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />
/// <reference path="../CommonInterfaces.ts" />
/// <reference path="../ComponentInterfaces.ts" />

module Blend.mvc {

    /**
    * @internal
    * Interface for defining a binding callback
    */
    interface IBindingCallback {
        [field: string]: Array<Function>
    }

    /**
    * @internal
    * Interface to register a field structure witihin a Model
    */
    interface IFieldRegistryItem {
        getValue: Function;
        formatValue: Function;
        bindTo: Array<string>;
    }

    /**
    * @internal
    * Interface to host IFieldRegistryItem items
    */
    interface IFieldRegistry {
        [name: string]: IFieldRegistryItem
    }

    /**
    * Base class for Model. You can create a model either by deriving from this class
    * or create a Model instance and pass an Blend.mvc.IModelConfig to the constructor
    */
    export class Model extends Component {

        protected id: string
        protected initialConfig:IModelConfig

        private fieldValues: IDictionary
        private fields: IFieldRegistry
        private bindingCallbacks: IBindingCallback

        constructor(config?: IModelConfig) {
            var me = this;

            super(config);

            me.fieldValues = {};
            me.fields = {};
            me.bindingCallbacks = {};

            me.id = me.initialConfig.id;
            me.defineFields(me.initialConfig.fields);
        }

        /**
        * Initializes the provided config assigned to the constructor
        */
        protected initConfig(config?: IModelConfig): IModelConfig {
            var defaultConfig:IModelConfig = {
                id:null,
                fields:null
            }
            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }


        /**
        * Defines a list of fields within this model
        */
        protected defineFields(fields: Array<IModelFieldConfig|string>) {
            var me = this;
            Blend.forEach(fields, function(fieldConfig: IModelFieldConfig|string) {
                me.defineField(fieldConfig);
            });
        }

        /**
        * Defines a field within this Model
        */
        protected defineField(fieldConfig: IModelFieldConfig|string) {
            var me = this,
                config: IModelFieldConfig;
            if (Blend.isString(<string>fieldConfig)) {
                config = {
                    name: <string>fieldConfig,
                    bindTo: null,
                    formatter: null,
                    getValue: function() {
                        return me.fieldValues[<string>fieldConfig];
                    }
                }
            } else {
                config = <IModelFieldConfig>fieldConfig;
            }
            me.createField(config);
        }

        /**
        * Prepares and creates a field within this model by dynamically building getters
        * ans setters
        */
        private createField(fieldConfig: IModelFieldConfig) {
            var me = this,
                oField: IFieldRegistryItem,
                getterName: string,
                setterName: string,
                fieldName: string = fieldConfig.name,
                isComplex: boolean = me.isComplexField(fieldConfig);

            // initialize the field value
            me.fieldValues[fieldName] = me.fieldValues[fieldName] || null;

            oField = {
                formatValue: fieldConfig.formatValue ? fieldConfig.formatValue : me.defaultFormatter,
                bindTo: fieldConfig.bindTo || [],
                getValue: fieldConfig.getValue || null
            }

            if (!Blend.isFunction(fieldConfig.getValue)) {
                if (isComplex) {
                    throw new Error(`Complex field ${me.id}.${fieldName} must have a getValue() function to return a value based on ${fieldConfig.bindTo.join(' and ') }!`);
                } else {
                    var createGetValue = function(name: string): Function {
                        return function() {
                            return me.fieldValues[name]
                        }
                    };
                    oField.getValue = createGetValue(fieldName);
                }
            }

            // Let's create a getter for this field
            getterName = me.getGetterName(fieldName);
            me.setAttribute(getterName, function(raw: boolean = false) {
                if (raw === true && oField.formatValue) {
                    return oField.formatValue.apply(me, [oField.getValue.apply(me)]);
                } else {
                    return oField.getValue.apply(me, []);
                }
            });

            // Let's create a setter for this field
            setterName = me.getSetterName(fieldName);
            if (!me.isComplexField(fieldConfig)) {
                me.setAttribute(setterName, function(value: any) {
                    me.fieldValues[fieldName] = value;
                    me.publishBinding(fieldName, me.applyFunction(getterName, [true]));
                });
            } else {
                me.setAttribute(setterName, function(value: any) {
                    me.fieldValues[fieldName] = value;
                });

                var createCallback: Function = function(fname: string, gname: string) {
                    return function() {
                        me.publishBinding(fname, me.applyFunction(gname, [true]));
                    }
                }

                Blend.forEach(fieldConfig.bindTo, function(bfield: string) {
                    me.bind(bfield, createCallback(fieldName, getterName))
                });
            }

            me.fields[fieldName] = oField;
        }

        /**
        * Publishes a value to the bound properties
        */
        private publishBinding(fieldName: string, value: any) {
            var me = this;
            if (me.fields[fieldName] && me.bindingCallbacks[fieldName]) {
                Blend.forEach(me.bindingCallbacks[fieldName], function(callback: Function) {
                    callback.apply(me, [value || null]);
                });
            }
        }

        /**
        * Bind a setter callback function to a field within this Model
        */
        bind(field: string, propertySetter: Function) {
            var me = this;
            if (me.checkField(field)) {
                if (!me.bindingCallbacks[field]) {
                    me.bindingCallbacks[field] = [propertySetter];
                } else {
                    me.bindingCallbacks[field].push(propertySetter);
                }
            }
        }

        /**
        * Check if a given field exists within this Model
        */
        private checkField(field: string) {
            if (!this.fields[field]) {
                throw new Error(`${this.id} does not have a field named ${field}`);
            } else {
                return true;
            }
        }

        /**
        * Sets the values of the fields in this Model. This action triggers
        * all the handlers for bound View setters
        */
        setData(data: IDictionary) {
            var me = this,
                setterName: string;
            Blend.forEach(data, function(fieldValue: string, fieldName: any) {
                setterName = me.getSetterName(fieldName);
                if (me.hasFunction(setterName)) {
                    me.applyFunction(setterName, [fieldValue]);
                }
            });
        }

        /**
        * Checks if this field is a complex/composite field
        */
        private isComplexField(field: IModelFieldConfig) {
            return (field.bindTo && field.bindTo.length > 0) ? true : false;
        }

        /**
        * Creates a getter function name
        */
        private getGetterName(name: string) {
            return 'get' + Blend.ucFirst(name);
        }

        /**
        * Creates a setter function name
        */
        private getSetterName(name: string) {
            return 'set' + Blend.ucFirst(name);
        }

        /**
        * The default value formatter for this Model
        */
        protected defaultFormatter(value: any) {
            return value;
        }
    }
}