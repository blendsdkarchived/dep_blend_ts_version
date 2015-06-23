///<reference path="../Blend.ts"/>
///<reference path="../utils/Dom.ts"/>
module Blend {
    export module layout {
        export module utils {
            /**
             * Removed the positioning styles and
             * sets the data-layout to fitted
             */
            export function centerUtil(element: HTMLElement) {
                Blend.Dom.setStyle(element, {
                    display: null,
                    position: null,
                    top: null,
                    left: null,
                    margin: null
                });
                element.setAttribute('data-layout','center');
            }

        }

    }
}