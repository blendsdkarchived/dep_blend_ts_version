/// <reference path="CommonInterfaces.ts" />
/// <reference path="mvc/Controller.ts" />
/// <reference path="ui/View.ts" />

/**
 * Interface for defining a layoutConfig of a Blend.ui.View
 */
interface ILayoutConfig extends IComponentConfig {
    /**
     * @internal
     */
    view?: Blend.ui.View
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
interface IModelConfig extends IDictionary {
    id: string;
    fields: Array<string|IModelFieldConfig>;
}

/**
 * Interface for defining a View configuration
 */
interface IViewConfig extends IDictionary {

    //MVC

    bindings?: IStringDictionary;
    reference?: string;
    controllers?: Array<string|Blend.mvc.Controller>;

    //UI

    layout?: ILayoutConfig;
    visible?: boolean;
    cssClass?: string|IDictionary;
}

/**
 * Interface for defining View bounds and visibility
 * @internal
 */
interface IViewBounds {
    top?: number;
    left?: number;
    width?: number|string;
    height?: number|string;
    visible?: boolean;
}