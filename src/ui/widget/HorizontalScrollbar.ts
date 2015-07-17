/// <reference path="../../Blend.ts"/>
/// <reference path="../../dom/Dom.ts"/>
/// <reference path="Scrollbar.ts" />

module Blend.ui.widget {

    /**
     * Base class for a Scrollbar
     */
    export class HorizontalScrollbar extends Scrollbar {

        constructor() {
            var me = this;
            super();
            me.cssClass = 'hscroll'
        }

        public scrollTo(position: number) {
            var me = this;
            Blend.Dom.setStyle(me.handleEl, {
                left: position
            });
            me.scrollElement.scrollLeft = (position / me.trackSize) * me.scrollElement.scrollWidth;
        }

        getMovementSize(oldX: number, oldY: number, curX: number, curY: number): number {
            return Math.abs(curX - oldX);
        }


        getMovement(oldX: number, oldY: number, curX: number, curY: number): number {
            if (curX >= oldX) {
                return 1;
            } else {
                return -1;
            }
        }


        layout(trackSize: number, scrollSize: number, position: number) {
            var me = this;
            me.initEvents();
            Blend.Dom.setStyle(me.el, {
                height: me.scrollbarSize,
                width: me.trackSize = trackSize,
                top: position,
                left: 0
            });

            Blend.Dom.setStyle(me.handleEl, {
                width: me.hanldeSize = (trackSize / scrollSize) * trackSize,
                height: me.scrollbarSize,
                top: 0,
                left: 0
            });

        }
    }
}