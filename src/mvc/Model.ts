/// <reference path="../Blend.ts"/>

module Blend {
	export module mvc {

		export interface IModelConfig {
			modelId:string
			fields:Array<string>;
		}

		export class Model extends Blend.BaseClass implements IModelConfig {

			modelId:string;
			fields:Array<string>;
			data:any;
			bindings:any;

			constructor(config:IModelConfig) {
				super(config);
				if(!this.fields) {
					this.fields = [];
				}
				if(!this.data) {
					this.data = {};
				}
				this.bindings = {};
				this.createFields();
				Blend.mvc.Context.registerModel(this.modelId,this);
			}

			createFields():void {
				var me = this;
				me.fields.forEach(function(field){
					var setterName = 'set'+Blend.ucFirst(field);
					var getterName = 'get'+Blend.ucFirst(field);
					me[setterName] = function(value:any) {
						me.data[field] = value;
						if(me.bindings[field]) {
							me.bindings[field].forEach(function(setter){
								setTimeout(function(){
									setter.call(me,value);
								},1);
							});
						}
					}
					me[getterName] = function() {
						return me.data[field];
					}
				});
			}

			bind(field,setter:Function) {
				if(!this.bindings[field]) {
					this.bindings[field] = [setter];
				} else {
					this.bindings[field].push(setter);
				}
			}

			setData(data:any) {
				var me = this;
				for(var field in data) {
					if(me.fields.indexOf(field) !== -1) {
						var setterName = 'set'+Blend.ucFirst(field);
						me[setterName].call(me,[data[field]]);
					}
				}
			}
		}
	}
}