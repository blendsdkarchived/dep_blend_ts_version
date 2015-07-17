/// <reference path="../Layout.ts" />
/// <reference path="../../ui/ContainerView.ts" />
/// <reference path="../../ui/widget/VerticalScrollbar.ts" />
/// <reference path="../../ui/widget/HorizontalScrollbar.ts" />

module Blend.layout.component {

    export interface IContainerViewInnerLayout extends ILayoutConfig {
        viewElement: HTMLElement
        bodyElement: HTMLElement
        bodyContentElement: HTMLElement
        hScrollbar: Blend.ui.widget.HorizontalScrollbar
        vScrollbar: Blend.ui.widget.VerticalScrollbar
        allowScroll: eScroll
    }

    export class ContainerView extends Blend.layout.Layout {
        private bodyElement: HTMLElement
        private bodyContentElement: HTMLElement
        private hTop: number
        private hWidth: number
        private allowScroll: eScroll
        private bodyBounds: IViewBounds
        private hScrollbar: Blend.ui.widget.Scrollbar
        private vScrollbar: Blend.ui.widget.Scrollbar


        constructor(config: IContainerViewInnerLayout) {
            var me = this;
            super(config);
            me.setAttributes(me.initialConfig);
        }

        performLayout() {

            var me = this;
            me.bodyBounds = Blend.Dom.getStyle(me.bodyElement, ['top', 'left', 'width', 'height']);

            if (me.allowScroll === eScroll.None) {
                me.hideScrollbars();
            } else if (me.allowScroll === eScroll.Auto) {
                me.layoutAutoScroll();
            } else if (me.allowScroll === eScroll.FixedVertical) {
                 me.layoutFixedVertical();
            } else if (me.allowScroll === eScroll.FixedHorizontal) {
                me.layoutFixedHorizontal();
            } else if (me.allowScroll == eScroll.FixedBoth) {
                me.layoutFixedBoth();
            }
        }

        private layoutVertical(size: number = null) {
            var me = this;
            size = size || <number>me.bodyBounds.height;
            me.vScrollbar.layout(
                size,
                me.bodyContentElement.scrollHeight,
                <number>me.bodyBounds.width - me.hScrollbar.getSize());
        }

        private layoutHorizontal(size: number = null) {
            var me = this;
            size = size || <number>me.bodyBounds.width;
            me.hScrollbar.layout(
                size,
                me.bodyContentElement.scrollWidth,
                <number>me.bodyBounds.height - me.hScrollbar.getSize());
        }

        private layoutAutoScroll() {
            var me = this;
            me.layoutVertical();
            me.layoutHorizontal();
            me.hideScrollbars();
        }

        private layoutFixedHorizontal() {
            var me = this;
            Blend.Dom.setStyle(me.bodyContentElement, {
                height: <number>me.bodyBounds.height - me.vScrollbar.getSize()
            });
            me.layoutHorizontal();
        }

        private layoutFixedVertical() {
            var me = this;
            Blend.Dom.setStyle(me.bodyContentElement, {
                width: <number>me.bodyBounds.width - me.hScrollbar.getSize()
            });
            me.layoutVertical();
        }


        private layoutFixedBoth() {
            var me = this,
                trackWidth = <number>me.bodyBounds.width - me.hScrollbar.getSize(),
                trackHeight = <number>me.bodyBounds.height - me.vScrollbar.getSize();
            Blend.Dom.setStyle(me.bodyContentElement, {
                height: trackHeight,
                width: trackWidth
            });
            me.layoutHorizontal(trackWidth);
            me.layoutVertical(trackHeight);
        }

        private hideScrollbars() {
            var me = this;
            me.vScrollbar.hide();
            me.hScrollbar.hide();
        }

    }
}