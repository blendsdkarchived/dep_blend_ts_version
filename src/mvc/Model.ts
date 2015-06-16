/// <reference path="../Blend.ts"/>

module Blend {

	export module mvc {

		export interface IBindingCallback {
			[field:string]:Array<Function>
		}

		export interface IBindingData {
			[field:string]:any
		}

		export interface IModelFieldConfig {
			name:string;
			bindTo?:Array<string>;
			value?:() => any,
			formatter?:(value:any) => any
		}

		export interface IModelConfig {
			modelId:string;
			fields:Array<string|IModelFieldConfig>;
		}

		export class Model extends Blend.BaseClass implements IModelConfig {

			modelId:string;
			fields:Array<string|IModelFieldConfig>|any;
			fieldValues:IBindingData;
			bindingCallbacks:IBindingCallback;

			constructor(config:IModelConfig) {
				super(config);
				if(!this.fieldValues) this.fieldValues = {};
				if(!this.bindingCallbacks) this.bindingCallbacks = {};
				this.createFields();
				Blend.mvc.Context.registerModel(this.modelId,this);
			}

			createFields() {
				var me = this,
					fields,
					field:IModelFieldConfig;
				me.prepareFields(me.fields).forEach(function(item){
					me.createField(item);
				});
			}

			prepareFields(fields:Array<IModelFieldConfig|string>)  {
				var me = this,
					result:Array<IModelFieldConfig> = [],
					field:IModelFieldConfig;
				fields.forEach(function(item){
					if(Blend.isString(item)) {
						field = {
							name:<string>item,
							bindTo:null,
							formatter:null,
							value:function() {
								return me.fieldValues[<string>item];
							}
						}
					} else {
						field = <IModelFieldConfig>item;
					}
					result.push(field);
				});
				// reset fields from array format to dictionary/index
				me.fields = {};
				return result;
			}

			createField(field:IModelFieldConfig) {
				var me = this,
					oField,
					getterName,
					setterName;
				var isComplex = me.isComplexField(field);

				me.fieldValues[field.name] = me.fieldValues[field.name] || null;

				oField = {
					formatter:field.formatter ?  field.formatter :  me.defaultFormatter,
					bindTo:field.bindTo || [],
					value:field.value || null
				}

				if(isComplex === true && !field.value) {
					throw new Error(`Complex field ${me.modelId}.${field.name} must have a value() function!`);
				}

				getterName = me.getGetterName(field.name);
				me[getterName] = function(raw:boolean=false) {
					if(raw === true && oField.formatter) {
						return oField.formatter.apply(me,[oField.value.apply(me)]);
					} else {
						return oField.value.apply(me,[]);
					}
				}


				setterName = me.getSetterName(field.name);

				if(!me.isComplexField(field)) {
					me[setterName] = function(value:any) {
						me.fieldValues[field.name] = value;
						me.publishBinding(field.name,me[getterName].apply(me,[true]));
					}
				} else {
					me[setterName] = function(value:any) {
						me.fieldValues[field.name] = value;
					}
					var createCallback = function(fname,gname) {
						return function() {
							me.publishBinding(fname,me[gname].apply(me,[true]));
						}
					}
					field.bindTo.forEach(function(bfield){
						me.bind(bfield,createCallback(field.name,getterName))
					});
				}

				me.fields[field.name] = field;
			}

			bind(field,viewSetter:Function) {
				var me = this;
				if(me.checkField(field)) {
					if(!this.bindingCallbacks[field]) {
						this.bindingCallbacks[field] = [viewSetter];
					} else {
						me.bindingCallbacks[field].push(viewSetter);
					}
				}
			}


			checkField(field:string) {
				if(!this.fields[field]) {
					throw new Error(`${this.modelId} does not have a field named ${field}`);
				} else {
					return true;
				}
			}

			isComplexField(field:IModelFieldConfig) {
				return (field.bindTo && field.bindTo.length > 0) ? true : false;
			}

			getGetterName(name) {
				return 'get'+ Blend.ucFirst(name);
			}

			getSetterName(name) {
				return 'set' + Blend.ucFirst(name);
			}

			defaultFormatter(value) {
				return value;
			}

			setData(data:IBindingData) {
				var me = this,
					setterName;
				for(var field in data) {
					if(me.fields[field]) {
						setterName = me.getSetterName(field);
						me[setterName].apply(me,[data[field]]);
					}
				}
			}

			publishBinding(fieldName,value) {
				var me = this;
				if(me.fields[fieldName] && me.bindingCallbacks[fieldName]) {
					me.bindingCallbacks[fieldName].forEach(function(setter){
						setter.apply(me,[value||null]);
					});
				}
			}

		}
	}
}