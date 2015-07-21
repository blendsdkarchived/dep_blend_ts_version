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
        protected scrollSize: number;
        protected hanldeSize: number;
        protected handleEl: HTMLElement;
        protected currentPosition: number;
        protected scrollElement: HTMLElement;
        protected staticUnits: number;
        protected enableMouseWheel: boolean;

        private initialized: boolean;
        private scrolling: boolean;
        private oldX: number;
        private oldY: number;
        private wheelMovementSize: number


        protected scrollToInternal(handlePosition: number, scrollPosition: number): void { }
        protected layoutInternal(position: number): void { }
        protected getMovementSize(oldX: number, oldY: number, curX: number, curY: number): number { return 0; }
        protected getMovement(oldX: number, oldY: number, curX: number, curY: number): number { return 0; }


        constructor() {
            var me = this;
            super();
            me.scrollbarSize = 12;
            me.scrolling = false;
            me.initialized = false;
            me.oldX = me.oldY = me.wheelMovementSize = -1;
            me.staticUnits = me.trackSize = me.hanldeSize = me.currentPosition = 0;
            me.enableMouseWheel = true;
        }

        getCurrentPosition() {
            return this.currentPosition;
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

            var me = this,
                wheelDirection = -1,
                wheelEventDist = new Date().getTime(),
                mouseWheelEventHandler = function(e: MouseWheelEvent) {
                    var t = new Date().getTime();
                    if (t - wheelEventDist < 30) {
                        return;
                    } else {
                        wheelEventDist = t;
                        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || e.detail)));
                        if (me.wheelMovementSize === -1) {
                            me.wheelMovementSize = me.trackSize / 20;
                        }
                        if (delta === wheelDirection) {
                            me.currentPosition += me.wheelMovementSize;
                        } else {
                            me.currentPosition -= me.wheelMovementSize;
                        }

                        me.oldX = me.oldY = 0;
                        me.scrollHandleTo(me.currentPosition);
                    }
                };

            me.oldX = me.oldY = -1;

            if (!me.initialized) {
                me.initialized = true;

                me.handleEl.addEventListener('mousedown', function(e: MouseEvent) {
                    var target: HTMLElement = <HTMLElement>(e.target || e.srcElement),
                        rect = target.getBoundingClientRect();
                    me.oldX = e.screenX;
                    me.oldY = e.screenY;
                });

                if (me.enableMouseWheel === true) {
                    me.scrollElement.addEventListener("mousewheel", function() {
                        wheelDirection = -1;
                        return mouseWheelEventHandler.apply(me, arguments);
                    });


                    me.scrollElement.addEventListener("DOMMouseScroll", function() {
                        wheelDirection = 1;
                        return mouseWheelEventHandler.apply(me, arguments);
                    });
                }

                me.el.addEventListener('mousedown', function(e: MouseEvent) {
                    console.log(e.button);
                    me.scrolling = (e.target === me.handleEl) && (e.button === 0);
                });

                me.el.addEventListener('mouseup', function() {
                    me.scrolling = false;
                });

                document.addEventListener('mouseup', function(e: MouseEvent) {
                    me.scrolling = false;
                });

                document.addEventListener('mousemove', function(e: MouseEvent) {
                    var msize: number, p: Array<number>;
                    if (me.scrolling) {
                        msize = me.getMovementSize(me.oldX, me.oldY, e.screenX, e.screenY);
                        if (me.getMovement(me.oldX, me.oldY, e.screenX, e.screenY) === 1) {
                            me.currentPosition += msize;
                        } else {
                            me.currentPosition -= msize;
                        }
                        me.oldX = e.screenX;
                        me.oldY = e.screenY;
                        me.scrollHandleTo(me.currentPosition);
                    }
                });
            }
        }

        scrollTo(position: number) {
            var me = this;
            me.scrollHandleTo((position * me.trackSize) / me.scrollSize);
        }

        protected scrollHandleTo(handlePosition: number) {
            var me = this,
                scrollPosition: number;

            if (handlePosition < 0) {
                handlePosition = 0;
            } else if (handlePosition + me.hanldeSize > me.trackSize) {
                handlePosition = me.trackSize - me.hanldeSize;
            }
            if (me.staticUnits !== 0) {
                scrollPosition = handlePosition * me.staticUnits;
            } else {
                scrollPosition = (handlePosition / me.trackSize) * me.scrollSize;
            }
            me.currentPosition = handlePosition;
            me.scrollToInternal(handlePosition, scrollPosition);
        }

        layout(trackSize: number, scrollSize: number, position: number) {
            var me = this,
                currentScrollPosition = -1,
                handleSize = (trackSize / scrollSize) * trackSize;

            // reset the wheel moment size since the track size may have been changed!
            me.wheelMovementSize = -1;

            if (me.trackSize !== 0 && trackSize !== me.trackSize) {
                // case of resized view
                currentScrollPosition = (me.currentPosition * trackSize) / me.trackSize;
            }

            me.scrollSize = scrollSize;
            me.initEvents();

            if (handleSize < me.scrollbarSize) {
                handleSize = me.scrollbarSize;
                me.staticUnits = (1 / (trackSize - handleSize)) * scrollSize;
            } else {
                me.staticUnits = 0;
            }

            me.trackSize = trackSize;
            me.hanldeSize = handleSize;

            me.layoutInternal(position);
            if (currentScrollPosition !== -1) {
                me.scrollHandleTo(currentScrollPosition);
            }
        }

        render(): HTMLElement {
            var me = this;
            return Blend.Dom.createElement({
                cls: Blend.cssPrefix(['scrollbar', me.cssClass]),
                unselectable: true,
                children: [
                    {
                        tag: 'a',
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