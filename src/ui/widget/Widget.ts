/// <reference path="../../Blend.ts"/>
/// <reference path="../../dom/Dom.ts"/>
/// <reference path="../../Component" />


module Blend.ui.widget {

    /**
     * Base class for all Widgets
     */
    export class Widget extends Blend.Component {

        protected el: HTMLElement

        constructor(config?: DictionaryInterface) {
            var me = this;
            super(config);
        }

        getBounds(): ViewBoundsInterface {
            var me = this;
            if (me.el) {
                return Blend.Dom.getStyle(me.el, ['top', 'left', 'width', 'height']);
            } else {
                return null;
            }
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