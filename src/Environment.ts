///<reference path="Blend.ts"/>
///<reference path="dom/Dom.ts"/>

module Blend {

    /**
     * @private
     * Callback interface for the ready function
     */
    interface IReadCallback {
        fn: Function
        sc?: any
    }

    /**
     * This class provides functionality to get a Blend application kickstarted
     * It also checks for browser support and handles the ready(...) callbacks.
     *
     * This class is availble from Blend.Environment as singleton.
     */
    export class EnvironmentSingleton {

        private readyCallbacks: Array<IReadCallback>
        private kickStarted: boolean = false
        private scrollbarSize: number
        private isIE: boolean
        private ieVersion: number


        /**
         * retuns true if the current browser is IE
         */
        getIsIE() {
            return this.isIE;
        }

        /**
         * Retunsthe size of the scrollbars
         */
        getScrollbarSize() {
            var me = this;
            if (!me.scrollbarSize) {
                var i: HTMLElement = Blend.Dom.createElement({
                    style: {
                        width: '100%',
                        height: 200
                    }
                }),
                    p: HTMLElement = Blend.Dom.createElement({
                        style: {
                            visibility: 'hidden',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 200,
                            height: 150,
                            overflow: 'hidden'
                        },
                        children: [i]
                    }),
                    io: number, oo: number, r: number;
                document.body.appendChild(p);

                io = i.offsetWidth;
                p.style.setProperty('overflow', 'scroll');
                oo = i.offsetWidth;
                if (io == oo) {
                    oo = p.clientWidth;
                }
                Blend.Dom.removeElement(p);
                me.scrollbarSize = (io - oo);
            }
            return me.scrollbarSize;
        }

        constructor() {
            var me = this;
        }

        reset() {
            var me = this;
            me.readyCallbacks = [];
        }

        ready(callback: Function, scope?: any) {
            var me = this;
            if (!me.readyCallbacks) {
                me.readyCallbacks = [];
            }
            me.readyCallbacks.push({
                fn: callback,
                sc: scope || me
            });
        }

        private isSupportedBrowser(): boolean {
            var me = this;
            if (me.isIE && me.ieVersion < 9) {
                document.write('<div id="noblend">Unable to run this application. Please upgrade your Internet Explorer to version 9 or above, otherwise use Google Chrome or Firefox!</div>');
                return false;
            } else {
                return true;
            }
        }

        private detectBrowser() {
            var me = this,
                browser: string = navigator.userAgent.toLowerCase(),
                msie: string = ((/msie (\d+)/.exec(browser) || [])[1]);
            if (Blend.isNullOrUndef(msie)) {
                msie = ((/trident\/.*; rv:(\d+)/.exec(browser) || [])[1]);
            }

            me.isIE = !Blend.isNullOrUndef(msie);
            if (me.isIE) {
                me.ieVersion = parseInt(msie);
            } else {
                me.ieVersion = null;
            }
        }

        /**
         * Initiates Blend's application lifecycle by executing the callbacks
         * which are registered by {Environment.ready}. This function needs to called
         * to get a Blend application started.
         */
        kickStart() {
            var me = this,
                didRun = false,
                doCallback = function() {
                    if (didRun === false) {
                        didRun = true;
                        if (me.isSupportedBrowser()) {
                            Blend.forEach(me.readyCallbacks, function(item: IReadCallback) {
                                item.fn.apply(item.sc, []);
                            });
                        }
                    }
                    // empty the callbacks after running once incase we have late
                    // ready(...) calls later, so we don't run previous calls again.
                    me.readyCallbacks = [];
                };

            if (!me.kickStarted) {
                me.kickStarted = true;
                me.detectBrowser();
                if (document.readyState === "complete") {
                    setTimeout(doCallback, 5);
                } else {
                    me.addEventListener(document, 'DOMContentLoaded', doCallback);
                    me.addEventListener(window, 'load', doCallback);
                }
            } else {
                setTimeout(doCallback, 5);
            }
        }

        /**
         * Adds an EventListener to an EventTarget
         */
        addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        /**
         * Removes an EventListener from an EventTarget
         */
        removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }
    }
    /**
     *  The Environment object available from Blend.Environment
     */
    export var Environment = new EnvironmentSingleton();
}