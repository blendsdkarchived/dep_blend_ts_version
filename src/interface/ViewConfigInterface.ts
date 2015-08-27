/// <reference path="StringDictionaryInterface" />
/// <reference path="LayoutConfigInterface" />

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