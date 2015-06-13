/// <reference path="../Blend.ts"/>
module Blend {

	export module mvc {

		export interface IViewConfig {
			reference?:string;
			bindings?:any;
			controllers?:Array<string>;
		}

		export class View extends Blend.BaseClass implements IViewConfig {

			parent:View;
			reference:string;
			controllers:Array<any>;
			bindings:any;

			constructor(config?:IViewConfig) {
				super(config);
				this.register();
				this.processBindings();
			}

			fireEvent(eventName:string,...args:any[]) {
				var me = this,
					controller;
				if(me.controllers) {
					me.controllers.forEach(function(ctrlId){
						controller = Blend.mvc.Context.getController(ctrlId);
						setTimeout(function(){
							controller.delegate(me.reference+'.'+eventName,me,args);
						},1);
					});
				}
			}

			processBindings():void {
				var me = this;
				if(this.bindings) {
					for(var key in this.bindings) {
						if(Blend.isString(this.bindings[key])) {
							var value:Array<string> = this.bindings[key].toString().split('.');
							if(value.length == 2) {
								var setterName = 'set'+Blend.ucFirst(key);
								if(this[setterName]) {
									var modelName = value[0];
									var fieldName = value[1];
									var model = Blend.mvc.Context.getModel(modelName);
									if(model) {
										model.bind(fieldName,function(){
											me[setterName].apply(me,arguments);
										});
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
						} else {
							throw new Error("Binding key is not a string!");
						}
					}
				}
			}

			register() : void {
				var me = this;
				// an empty array is the same as having no controllers!
				if(this.controllers && this.controllers.length == 0) {
					this.controllers = null;
				}
				if(this.reference) {
					// has a reference but no controllers.
					// so we travel up until we find a parent with controllers
					if(!this.controllers) {
						var view = this,parent;
						while(!Blend.isNullOrUndef(parent = view.parent)) {
							if(parent.hasControllers()) {
								this.controllers = parent.controllers;
								break;
							}
						}
					}
				}
				// check if we have valid controllers
				if(this.controllers) {
					var controller:Controller;
					this.controllers.forEach(function(item,index){
						controller = Blend.mvc.Context.getController(item);
						if(controller) {
							if(me.reference) {
								controller.registerView(me);
							}
						} else {
							throw new Error(`Controler by id ${item} was not found!`);
						}
					});
				}
			}

			hasControllers():boolean {
				return (this.controllers && this.controllers.length !== 0);
			}
		}
	}
}