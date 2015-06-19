# BlendJS SDK

BlendJS SDK is a TypeScript Application Framework for building mobile and web application.

## UPDATE

At the moment this framework in heavily in development and not ready to be used. The following in a code snippet
showing how a basic application is created.
```typescript
/// <reference path="../blend/js/blend.d.ts"/>
module MyApp {
	
	/**
	 * Sample Controller Class
	 */
	class MyController extends Blend.mvc.Controller {
		constructor() {
			super('my.controller');
			this.on('application.resize', this.resized);
			this.on('application.ready', function(){
				console.log('we are ready');
			});
		}

		resized(sender: Blend.ui.Application,evt:Event): void {
			console.log(evt);
		}
	}
	
	/**
	 * Sample Model Creation
	 */
	var AppModel = new Blend.mvc.Model({
		modelId:'model1',
		fields:[
			'status',
			'profile',
			'permission'
		]
	});
	
	/**
	 * Sample View Creation and binding to a Model
	 */
	class MainView extends Blend.ui.View {
		
		/**
		 * Bind setTitle to AppModel.status
		 */
		bindings:Blend.mvc.IBinding = {			
			'title':'model1.status'
		}
		
		setTitle(value:string) {
			//....
		}		
	}
	
	/**
	 * Will call MainView.setTitle, happy binding... :)
	 */
	AppModel.setData({
		status:'READY'
	});
	
	/**
	 * Sample Application Creation
	 */
	export var app = new Blend.ui.Application({
		mainView: new MainView(),
		controllers:[
			new MyController()
		]
	});
	
	app.run();
}
````
