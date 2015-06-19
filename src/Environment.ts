///<reference path="Blend.ts"/>
///<reference path="utils/Dom.ts"/>

module Blend {
    
    /**
     * @private
     * Callback interface for the ready function
     */
    interface IReadCallback {
        fn: Function;
        sc?: any;
    }

    export class EnvironmentSingleton {

        private readyCallbacks: Array<IReadCallback>;
        kickStarted: boolean = false;
        isIE: boolean;
        ieVersion: number;

        constructor() {
            var me = this;
            me.kickStart();
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

        isSupportedBrowser(): boolean {
            var me = this;
            if (me.isIE && me.ieVersion < 9) {
                document.write('<div id="noblend">Unable to run this application. Please upgrade your Internet Explorer to version 9 or above, otherwise use Google Chrome or Firefox!</div>');
                return false;
            } else {
                return true;
            }
        }

        detectBrowser() {
            var me = this,
                browser = navigator.userAgent.toLowerCase(),
                msie = ((/msie (\d+)/.exec(browser) || [])[1]);
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
         * which are registered by {Environment.ready}
         */
        kickStart() {
            var me = this,
                didRun = false,
                doCallback = function() {
                    if (didRun === false) {
                        didRun = true;
                        if (me.isSupportedBrowser()) {
                            Blend.forEach(me.readyCallbacks, function(item) {
                                item.fn.apply(item.sc, []);
                            });
                        }
                    }
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
            }
        }

        addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }
        
    }

    export var Environment = new EnvironmentSingleton();
}