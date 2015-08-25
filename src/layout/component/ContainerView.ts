/// <reference path="../../Blend.ts" />
/// <reference path="../Layout.ts" />
/// <reference path="../../ui/ContainerView.ts" />

module Blend.layout.component {

    export interface IContainerViewInnerLayout extends LayoutConfigInterface {
        viewElement: HTMLElement
        bodyElement: HTMLElement
        bodyContentElement: HTMLElement
        allowScroll: eScroll
    }

    export class ContainerView extends Blend.layout.Layout {

        private bodyElement: HTMLElement
        private bodyContentElement: HTMLElement
        private hTop: number
        private hWidth: number
        private allowScroll: eScroll
        private bodyBounds: IViewBounds

        constructor(config: IContainerViewInnerLayout) {
            var me = this;
            super(config);
            me.setAttributes(me.initialConfig);
        }

        performLayout() {
            var me = this;
            me.bodyBounds = Blend.Dom.getStyle(me.bodyElement, ['top', 'left', 'width', 'height']);
            me.setScrollState(me.allowScroll);
        }

        private setScrollState(value:eScroll) {
            var me = this,
            scroll = Blend.getEnumValue<string>(eScroll,me.allowScroll).toLowerCase()
            me.bodyContentElement.setAttribute('data-scroll',scroll);
        }

    }
}