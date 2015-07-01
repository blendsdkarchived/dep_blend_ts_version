/// <reference path="CommonInterfaces.ts" />
/// <reference path="mvc/Controller.ts" />


interface IViewConfig extends IDictionary {
    bindings?: IStringDictionary;
    reference?:string;
    controllers?:Array<string|Blend.mvc.Controller>
}

/**
 * Interface for defining fields of a Model
 */
interface IModelFieldConfig {
    name: string;
    bindTo?: Array<string>;
    getValue?: () => any;
    formatValue?: (value: any) => any;
}

/**
 * Interface for defining a Model configuration
 */
interface IModelConfig {
    id: string;
    fields: Array<string|IModelFieldConfig>;
}