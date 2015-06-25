///<reference path="../Blend.ts"/>
///<reference path="../utils/Dom.ts"/>
module Blend.layout.utils {

    export function centerUtil(element: HTMLElement) {
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