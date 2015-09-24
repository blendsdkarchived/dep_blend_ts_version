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
    visible?: boolean
    cssClass?: string|DictionaryInterface
    border?:boolean

    // SIZE
    width?: number|string
    height?: number|string
    top?: number
    left?: number

    // BOX LAYOUT
    margins?: BoxLayoutMarginInterface
    split?: boolean
    flex?: number
    minWidth?:number,
    minHeight?:number
}