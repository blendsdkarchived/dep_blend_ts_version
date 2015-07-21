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
            me.enableMouseWheel = false;
        }

        protected scrollToInternal(handlePosition: number, scrollPosition: number): void {
            var me = this;
            Blend.Dom.setStyle(me.handleEl, {
                left: handlePosition
            });
            me.scrollElement.scrollLeft = scrollPosition;
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

        layoutInternal(position: number) {
            var me = this;
            Blend.Dom.setStyle(me.el, {
                height: me.scrollbarSize,
                width: me.trackSize,
                top: position,
                left: 0
            });

            Blend.Dom.setStyle(me.handleEl, {
                width: me.hanldeSize,
                height: me.scrollbarSize,
                top: 0,
                left: 0
            });
        }
    }
}