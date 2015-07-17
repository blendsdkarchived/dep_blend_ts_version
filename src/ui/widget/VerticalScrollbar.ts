/// <reference path="../../Blend.ts"/>
/// <reference path="../../dom/Dom.ts"/>
/// <reference path="Scrollbar.ts" />

module Blend.ui.widget {

    /**
     * Base class for a Scrollbar
     */
    export class VerticalScrollbar extends Scrollbar {

        constructor() {
            var me = this;
            super();
            me.cssClass = 'vscroll'
        }

        public scrollTo(position: number) {
            var me = this;
            Blend.Dom.setStyle(me.handleEl, {
                top: position
            });
            me.scrollElement.scrollTop = (position / me.trackSize) * me.scrollElement.scrollHeight;
        }

        getMovementSize(oldX: number, oldY: number, curX: number, curY: number): number {
            return Math.abs(curY - oldY);
        }


        getMovement(oldX: number, oldY: number, curX: number, curY: number): number {
            if (curY >= oldY) {
                return 1;
            } else {
                return -1;
            }
        }

        layout(trackSize: number, scrollSize: number, position: number) {
            var me = this;
            me.initEvents();
            Blend.Dom.setStyle(me.el, {
                height: me.trackSize = trackSize,
                width: me.scrollbarSize,
                top: 0,
                left: position
            });

            Blend.Dom.setStyle(me.handleEl, {
                width: me.scrollbarSize,
                height: me.hanldeSize = (trackSize / scrollSize) * trackSize,
                top: 0,
                left: 0
            });

        }

    }
}