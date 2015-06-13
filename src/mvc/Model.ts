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

			constructor(config:IModelConfig) {
				super(config);
				if(!this.fields) {
					this.fields = [];
				}
				Blend.mvc.Context.registerModel(this.modelId,this);				
			}
		}
	}
}