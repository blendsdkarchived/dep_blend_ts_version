/// <reference path="../Blend.ts"/>
/// <reference path="./BindingClient.ts"/>
module Blend {


	export module mvc {

		export interface IViewConfig {
			reference?:string;
			controllers?:Array<string>;
		}

		export class View extends Blend.mvc.BindingClient implements IViewConfig, Blend.mvc.IBindingClientConfig {

			parent:View;
			reference:string;
			controllers:Array<string>;
			bindings:Blend.mvc.IBinding;

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