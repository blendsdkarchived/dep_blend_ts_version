/// <reference path="../../Blend.ts"/>
/// <reference path="../../dom/Dom.ts"/>
/// <reference path="Widget.ts" />

module Blend.ui.widget {

    /**
     * Base class for a Scrollbar
     */
    export class Scrollbar extends Widget {

        protected cssClass: string;
        protected scrollbarSize: number;
        protected trackSize: number;
        protected hanldeSize: number;
        protected handleEl: HTMLElement;
        protected currentPosition: number;
        protected scrollElement: HTMLElement;

        private initialized: boolean;
        private scrolling: boolean;
        private oldX: number;
        private oldY: number;

        constructor() {
            var me = this;
            super();
            me.scrollbarSize = 14;
            me.scrolling = false;
            me.initialized = false;
            me.currentPosition = 0;
            me.oldX = me.oldY = -1;
        }

        setScrollElement(el: HTMLElement) {
            var me = this;
            me.scrollElement = el;
        }

        getSize(): number {
            return this.scrollbarSize;
        }

        hide() {
            var me = this;
            Blend.Dom.setStyle(me.el, {
                display: 'none'
            });
        }

        initEvents() {
            var me = this;
            if (!me.initialized) {
                me.initialized = true;

                me.handleEl.addEventListener('mousedown', function(e: MouseEvent) {
                    var p = me.getRelativePosition(e);
                    var target: HTMLElement = <HTMLElement>(e.target || e.srcElement),
                        rect = target.getBoundingClientRect();
                    me.oldX = e.screenX;
                    me.oldY = e.screenY;
                });

                me.el.addEventListener('mousedown', function(e: MouseEvent) {
                    me.scrolling = e.target === me.handleEl;
                });

                me.el.addEventListener('mouseup', function() {
                    me.scrolling = false;
                });

                document.addEventListener('mouseup', function(e: MouseEvent) {
                    me.scrolling = false;
                });

                document.addEventListener('mousemove', function(e: MouseEvent) {
                    var msize: number, p: Array<number>;
                    if (e.buttons === 1 && me.scrolling) {
                        msize = me.getMovementSize(me.oldX, me.oldY, e.screenX, e.screenY);
                        if (me.getMovement(me.oldX, me.oldY, e.screenX, e.screenY) === 1) {
                            me.currentPosition += msize;
                        } else {
                            me.currentPosition -= msize;
                        }
                        if (me.currentPosition < 0) {
                            me.currentPosition = 0;
                        }
                        me.oldX = e.screenX;
                        me.oldY = e.screenY;
                        me.scrollTo(me.checkScrollPosition());
                    }
                });
            }
        }

        private getRelativePosition(e: MouseEvent): Array<number> {
            var target: HTMLElement = <HTMLElement>(e.target || e.srcElement),
                rect = target.getBoundingClientRect();
            return [e.clientX - rect.left, e.clientY - rect.top];
        }

        private checkScrollPosition(): number {
            var me = this,
                p = me.currentPosition;
            if (p < 0) {
                p = 0;
            } else if (p + me.hanldeSize > me.trackSize) {
                p = me.trackSize - me.hanldeSize;
            }
            return me.currentPosition = p;
        }

        public scrollTo(position: number) {

        }

        protected calcScrollPosition(): number {
            return 0;
        }

        protected getMovementSize(oldX: number, oldY: number, curX: number, curY: number): number {
            return 0;
        }


        protected getMovement(oldX: number, oldY: number, curX: number, curY: number): number {
            return 0;
        }

        layout(trackSize: number, scrollSize: number, position: number) {
            var me = this;
            me.initEvents();
        }

        render(): HTMLElement {
            var me = this;
            return Blend.Dom.createElement({
                cls: Blend.cssPrefix(['scrollbar', me.cssClass]),
                unselectable: true,
                children: [
                    {
                        type:'a',
                        oid: 'handleEl',
                        cls: Blend.cssPrefix(['scrollbar-handle']),
                        unselectable: true
                    }
                ]
            }, function(el: HTMLElement, oid: string) {
                me.setAttribute(oid, el);
            });
        }
    }
}