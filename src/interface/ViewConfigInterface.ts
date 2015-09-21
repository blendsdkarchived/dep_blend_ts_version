/// <reference path="StringDictionaryInterface" />
/// <reference path="LayoutConfigInterface" />
/// <reference path="BoxLayoutInterface" />


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
    /**
     * Works only when the View is a child View of a container and the container either has a hbox or a
     * vbox layout
     */
    margins?: BoxLayoutMarginInterface;
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