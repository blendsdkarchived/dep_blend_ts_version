/// <reference path="CommonInterfaces.ts" />
/// <reference path="mvc/Controller.ts" />
/// <reference path="ui/View.ts" />

/**
 * Interface for defining a layoutConfig of a Blend.ui.View
 */
interface LayoutConfigInterface extends ComponentConfigInterface {
    /**
     * @internal
     */
    view?: Blend.ui.View
}

/**
 * Interface for providing configuration to a Layout component
 */
interface IContainerLayoutConfig extends LayoutConfigInterface {

}

/**
 * Interface for defining fields of a Model
 */
interface IModelFieldConfig {
    name: string
    bindTo?: Array<string>
    getValue?: () => any
    formatValue?: (value: any) => any
}

/**
 * Interface for defining a Model configuration
 */
interface IModelConfig extends IDictionary {
    id: string
    fields: Array<string|IModelFieldConfig>
}

/**
 * Interface for defining View bounds and visibility
 * @internal
 */
interface IViewBounds {
    top?: number
    left?: number
    width?: number|string
    height?: number|string
    visible?: boolean
}

/**
 * Interface for defining a View configuration
 */
interface IViewConfig extends ComponentConfigInterface {

    //MVC

    bindings?: IStringDictionary
    reference?: string
    controllers?: Array<string|Blend.mvc.Controller>

    //UI

    layout?: LayoutConfigInterface
    visible?: boolean
    cssClass?: string|IDictionary

    // SIZE

    width?: number|string
    height?: number|string
    top?: number
    left?: number

    // AS CONTAINER CHILD
    itemId?: string
}

enum eScroll {
    None,
    Auto,
    FixedBoth,
    FixedHorizontal,
    FixedVertical
}

interface IContainerViewConfig extends IViewConfig {

    views?: Array<Blend.ui.View|ComponentConfigInterface|string>
    bodyPadding?: number
    allowScroll?:eScroll
}

interface IApplicationConfig extends IViewConfig {
    mainView: Blend.ui.View|ComponentConfigInterface|string
}