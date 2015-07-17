/// <reference path="../../Blend.ts"/>
/// <reference path="../../dom/Dom.ts"/>
/// <reference path="../../Component.ts" />


module Blend.ui.widget {

    /**
     * Base class for all Widgets
     */
    export class Widget extends Blend.Component {

        protected el: HTMLElement;

        constructor(config?: IDictionary) {
            var me = this;
            super(config);
        }

        getElement() {
            var me = this;
            if (!me.el) {
                me.el = me.render();
            }
            return me.el || null;
        }

        protected render(): HTMLElement {
            return null;
        }
    }
}