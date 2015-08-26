/// <reference path="../Blend" />
/// <reference path="../Component" />

module Blend.layout {

    /**
     * Layout utility class providing core element layout functionality
     * This class is accessible from Blend.LayoutUtil instance
     */
    export class Util {

        /**
         * Foits a given HTMLelement inside its parent
         */
        fitElement(element: HTMLElement) {
            Blend.Dom.setStyle(element, {
                width: null,
                height: null,
                display: null,
                position: null,
                top: null,
                left: null,
                margin: null
            });
            Blend.Dom.cssClass(element, <string>Blend.cssPrefix('fitted'));
        }

        /**
         * Centers a given HHTMlElement within its parent
         */
        centerElement(element: HTMLElement) {
            Blend.Dom.setStyle(element, {
                display: null,
                position: null,
                top: null,
                left: null,
                margin: null
            });
            Blend.Dom.cssClass(element, <string>Blend.cssPrefix('center'));
        }

    }
}

module Blend {
    /**
     * Layout utility class providing core element layout functionality.
     */
    export var LayoutUtil = new Blend.layout.Util();
}