///<reference path="../mvc/View.ts"/>
module Blend {
	export module ui {

		export interface IViewConfig extends Blend.mvc.IViewConfig {

		}

		export class View extends Blend.mvc.View implements IViewConfig {

			el:HTMLElement;

			constructor(config?:IViewConfig) {
				super(config);
			}

			getElement():HTMLElement {
				return null;
			}

		}

	}
}