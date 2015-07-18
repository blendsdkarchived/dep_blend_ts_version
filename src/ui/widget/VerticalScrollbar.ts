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

        protected scrollToInternal(handlePosition:number,scrollPosition: number)  : void{
            var me = this;
            Blend.Dom.setStyle(me.handleEl, {
                top: handlePosition
            });
            me.scrollElement.scrollTop = scrollPosition;
        }

        protected getMovementSize(oldX: number, oldY: number, curX: number, curY: number): number {
            return Math.abs(curY - oldY);
        }

        protected getMovement(oldX: number, oldY: number, curX: number, curY: number): number {
            if (curY >= oldY) {
                return 1;
            } else {
                return -1;
            }
        }

        layoutInternal(position: number) {
            var me = this;
            Blend.Dom.setStyle(me.el, {
                height: me.trackSize,
                width: me.scrollbarSize,
                top: 0,
                left: position
            });

            Blend.Dom.setStyle(me.handleEl, {
                width: me.scrollbarSize,
                height: me.hanldeSize,
                top: 0,
                left: 0
            });
        }
    }
}