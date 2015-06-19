/// <reference path="Controller.ts"/>
/// <reference path="Model.ts"/>
module Blend {

	export module mvc {
		
		export interface IControllerDictionary {
			[name:string]:Blend.mvc.Controller
		}
		
		export interface IModelDictionary {
			[name:string]:Blend.mvc.Model
		}

		export class ContextSingleton {

			controllers:IControllerDictionary = {};
			models:IModelDictionary = {};

			getController(name: string): Controller {
				return this.controllers[name] || null;
			}

			getModel(name: string): Model {
				return this.models[name] || null;
			}

			registerModel(name: string, model: Model) {
				if (!this.models[name]) {
					this.models[name] = model;
				}
			}

			registerController(name: string, controller: Controller) {
				if (!this.controllers[name]) {
					this.controllers[name] = controller;
				}
			}

		}

		export var Context = new ContextSingleton();

	}
}