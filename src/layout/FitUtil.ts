///<reference path="../Blend.ts"/>
///<reference path="../utils/Dom.ts"/>
module Blend.layout.utils {
    /**
     * Removed the positioning styles and
     * sets the data-layout to fitted
     */
    export function fitUtil(element: HTMLElement) {
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
}