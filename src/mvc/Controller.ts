/// <reference path="Context.ts"/>

module Blend {
	export module mvc {

		interface eventHandler {
			handler:(view:View,...args:any[]) => void;
		}

		export class Controller {

			references:any = {};
			handlers:any = {};

			constructor(protected controllerId:string) {
				Blend.mvc.Context.registerController(controllerId,this);
			}

			delegate(eventPath:string,view:View,args:any[]) {
				var me = this;
				if(this.handlers[eventPath]) {
					var handlers = this.handlers[eventPath];
					handlers.forEach(function(handler){
						handler.apply(me,[view].concat(args));
					});
				} else {
					throw Error(`No event handlers found for event pathn ${eventPath}!`);
				}
			}

			on(eventPath,handler:Function):void {
				if(!this.handlers[eventPath]) {
					this.handlers[eventPath] = [handler];
				} else {
					this.handlers[eventPath].push(handler);
				}
			}

			registerView(view:View):void {
				var refId = view.reference;
				if(!this.references[refId]) {
					this.references[refId] = [view];
				} else {
					this.references[refId].push(view);
				}
			}
		}
	}
}