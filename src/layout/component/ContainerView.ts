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

        /**
         * The ContainerView layout is responsible for placing and the
         * layout of the scrollbars. It attatches mouse events to show
         * and hide the scrollbars in auto mode and makes the bodyContentElement
         * smaller if the scrollbars are in fixed mode
         */

        private bodyElement: HTMLElement
        private bodyContentElement: HTMLElement
        private hTop: number
        private hWidth: number
        private allowScroll: eScroll
        private bodyBounds: IViewBounds
        private hScrollbar: Blend.ui.widget.Scrollbar
        private vScrollbar: Blend.ui.widget.Scrollbar
        private didAutoScrollEvents: boolean


        constructor(config: IContainerViewInnerLayout) {
            var me = this;
            super(config);
            me.setAttributes(me.initialConfig);
            me.didAutoScrollEvents = false;
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

        /**
         * Layouts the vertical scrollbar
         */
        private layoutVertical(size: number = null) {
            var me = this;
            size = size || <number>me.bodyBounds.height;
            me.vScrollbar.layout(
                size,
                me.bodyContentElement.scrollHeight,
                <number>me.bodyBounds.width - me.hScrollbar.getSize(),
                (me.allowScroll !== eScroll.Auto)
                );
        }

        /**
         * Layouts the horizontal scrollbar
         */
        private layoutHorizontal(size: number = null) {
            var me = this;
            size = size || <number>me.bodyBounds.width;
            me.hScrollbar.layout(
                size,
                me.bodyContentElement.scrollWidth,
                <number>me.bodyBounds.height - me.hScrollbar.getSize(),
                (me.allowScroll !== eScroll.Auto)
                );
        }

        /**
         * Check and show the vertical scrollbar is auto mode
         */
        private checkShowVScroller(e: MouseEvent) {
            var me = this;
            if (!me.vScrollbar.isVisible() && !me.hScrollbar.isScrolling()) {
                me.vScrollbar.show();
            }
        }

        /**
         * Check and show the horizontal scrollbar is auto mode
         */
        private checkShowHScroller(e: MouseEvent) {
            var me = this;
            if (!me.hScrollbar.isVisible() && !me.vScrollbar.isScrolling()) {
                me.hScrollbar.show();
            }
        }

        /**
         * Layouts the scrollbars in auto mode.
         * [1] The scrollbars will (dis)apear when the mouse moves (out)in of the
         * bodyElement both for horizontal and vertical scrollbars
         */
        private layoutAutoScroll() {
            var me = this;
            me.layoutVertical();
            me.layoutHorizontal();

            if (!me.didAutoScrollEvents) {

                // verticall
                me.bodyElement.addEventListener('mouseover', function(e: MouseEvent) {
                    me.checkShowVScroller.apply(me, arguments);
                });
                me.bodyElement.addEventListener('mouseenter', function(e: MouseEvent) {
                    me.checkShowVScroller.apply(me, arguments);
                });
                me.bodyElement.addEventListener('mouseout', function(e: MouseEvent) {
                    if (me.vScrollbar.isVisible() && !me.vScrollbar.isScrolling()) {
                        me.vScrollbar.hide();
                    }
                });

                // horizontal
                me.bodyElement.addEventListener('mouseover', function(e: MouseEvent) {
                    me.checkShowHScroller.apply(me, arguments);
                });
                me.bodyElement.addEventListener('mouseenter', function(e: MouseEvent) {
                    me.checkShowHScroller.apply(me, arguments);
                });
                me.bodyElement.addEventListener('mouseout', function(e: MouseEvent) {
                    if (me.hScrollbar.isVisible() && !me.hScrollbar.isScrolling()) {
                        me.hScrollbar.hide();
                    }
                });

                //hide one handle if the other one is being used
                me.bodyElement.addEventListener('mousedown', function(e: MouseEvent) {
                    var el: HTMLElement = <HTMLElement>e.target;
                    if (el.getAttribute('class').indexOf('vhandle') !== -1) {
                        me.hScrollbar.hide();
                    } else {
                        me.vScrollbar.hide();
                    }
                });

            }
            me.hideScrollbars();
        }

        /**
         * Layouts the horizontal scrollbar in fixed mode and shortens the width
         * of the bodyContentElement
         */
        private layoutFixedHorizontal() {
            var me = this;
            Blend.Dom.setStyle(me.bodyContentElement, {
                height: <number>me.bodyBounds.height - me.vScrollbar.getSize()
            });
            me.layoutHorizontal();
        }

        /**
         * Layouts the vertical scrollbar in fixed mode and shortens the height
         * of bodyContentElement
         */
        private layoutFixedVertical() {
            var me = this;
            Blend.Dom.setStyle(me.bodyContentElement, {
                width: <number>me.bodyBounds.width - me.hScrollbar.getSize()
            });
            me.layoutVertical();
        }


        /**
         * Layouts both scrollbars in fixed mode and makes the bodyContentElement
         * smaller both vertically and horizontally
         */
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

        /**
         * Hodes the scrollbars when allowScroll is set to none
         */
        private hideScrollbars() {
            var me = this;
            me.vScrollbar.hide();
            me.hScrollbar.hide();
        }

    }
}