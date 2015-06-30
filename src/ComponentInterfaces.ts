/// <reference path="CommonInterfaces.ts" />

interface IViewConfig extends IDictionary {
    bindings?: IStringDictionary;
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