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
interface ContainerLayoutConfigInterface extends LayoutConfigInterface {

}

/**
 * Interface for defining fields of a Model
 */
interface ModelFieldConfigInterface {
    name: string
    bindTo?: Array<string>
    getValue?: () => any
    formatValue?: (value: any) => any
}

/**
 * Interface for defining a Model configuration
 */
interface ModelConfigInterface extends DictionaryInterface {
    id: string
    fields: Array<string|ModelFieldConfigInterface>
}

/**
 * Interface for defining View bounds and visibility
 * @internal
 */
interface ViewBoundsInterface {
    top?: number
    left?: number
    width?: number|string
    height?: number|string
    visible?: boolean
}

/**
 * Interface for defining a View configuration
 */
interface ViewConfigInterface extends ComponentConfigInterface {

    //MVC

    bindings?: StringDictionaryInterface
    reference?: string
    controllers?: Array<string|Blend.mvc.Controller>

    //UI

    layout?: LayoutConfigInterface
    visible?: boolean
    cssClass?: string|DictionaryInterface

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

interface ContainerViewConfigInterface extends ViewConfigInterface {

    views?: Array<Blend.ui.View|ComponentConfigInterface|string>
    bodyPadding?: number
    allowScroll?:eScroll
}

interface ApplicationConfigInterface extends ViewConfigInterface {
    mainView: Blend.ui.View|ComponentConfigInterface|string
}