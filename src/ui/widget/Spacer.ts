/// <reference path="../../Blend.ts" />
/// <reference path="SpacerInterface.ts" />
/// <reference path="../../dom/Dom.ts" />

/// <reference path="Widget.ts" />

module Blend.ui.widget {

    export class Spacer extends Widget {

        constructor(config?: SpacerInterface) {
            var me = this;
            super(config);
        }

        protected render(): HTMLElement {
            /**
             * Just render an empty DIV. The Size and positioning of this
             * div will be set be the layout that is using the spacer
             */
            return Blend.Dom.createElement({
                cls:Blend.cssPrefix('spacer')
            });
        }

    }
}