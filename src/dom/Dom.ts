///<reference path="../CommonInterfaces.ts"/>
///<reference path="../Blend.ts"/>
///<reference path="../Environment.ts"/>
module Blend.dom {

    /**
     * This class provides basic utilities for manipulating DOM Element.
     * This class is availble from Blend.Dom as singleton
     */
    export class DomSingleton {

        private unitPropertyRe: RegExp = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/
        private unitTypeRe: RegExp = /(em$|\%$|auto|^calc)/
        private pixelRe = /px$/
        private UNIT: string = 'px'

        getBodyElement(content?: DocumentFragment|HTMLElement, clear?: boolean): HTMLElement {
            if (clear === true) {
                document.body.innerHTML = '';
            }
            if (content) {
                document.body.appendChild(content);
            }
            return document.body;
        }

        /**
         * Removes a HTMLElement from its parent's container
         */
        removeElement(el: HTMLElement) {
            if (el && el.parentNode) {
                return el.parentNode.removeChild(el);
            } else {
                return null;
            }
        }

        /**
         * Removes the child elements of a given HTMLElement
         */
        clearElement(el: HTMLElement) {
            var me = this;
            if (el) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            }
        }

        /**
         * Adds an EventListener to an EventTarget
         */
        addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            Blend.Environment.addEventListener.apply(this, arguments);
        }

        /**
         * Removes an EventListener from an EventTarget
         */
        removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            Blend.Environment.removeEventListener.apply(this, arguments);
        }

        /**
         * Assigns or removes css classes on an HTMLElement. Calling this function
         * without the cls argument will return a dictionary with class names.
         *
         * Usage: given <p class="abc" />
         * {
         *      mycls: true // results to class="abc mycls"
         *      abc: false // results to class="mycls"
         * }
         */
        cssClass(el: HTMLElement, cls?: string|IDictionary): IDictionary {
            var me = this;
            if (cls) {
                if (Blend.isString(cls)) {
                    var a: string = <string>cls;
                    cls = <IDictionary>{};
                    (<IDictionary>cls)[a] = true;
                }
                var cur = me.cssClass(el),
                    re: Array<string> = [], s: string;
                cur = Blend.apply(cur, cls, true);
                Blend.forEach(cur, function(v: boolean, k: string) {
                    if (v === true) {
                        re.push(k);
                    }
                });
                s = re.join(' ');
                if (s != '') {
                    el.setAttribute('class', s);
                }
                return cur;
            } else {
                var value = el.getAttribute('class');
                if (value && value !== '') {
                    var r: IDictionary = {};
                    Blend.forEach(value.split(' '), function(cls: string) {
                        if (cls !== '') {
                            r[cls] = true;
                        }
                    });
                    return r;
                } else {
                    return {};
                }
            }
        }

        /**
         * Returns a dictionary with style information
         */
        getStyle(el: HTMLElement, styles: string[]): IStyleConfig {
            var me = this;
            if (el) {
                var cs = window.getComputedStyle(el, null),
                    r: IStyleConfig = {};
                Blend.forEach(styles, function(key: string) {
                    r[key] = me.fromUnit(cs.getPropertyValue(key));
                });
                return r;
            } else {
                return null;
            }
        }

        /**
         * Set the styles of a HTMLElement
         */
        setStyle(el: HTMLElement, styles: IStyleConfig) {
            var me = this,
                setter = function(el: HTMLElement, k: string, v: any) {
                    if (v === null) {
                        el.style.removeProperty(k);
                    } else {
                        if (Blend.Environment.getIsIE()) {
                            (<any>el.style)[k] = v;
                        } else {
                            el.style.setProperty(k, v);
                        }
                    }
                };

            if (styles) {
                Blend.forEach(styles, function(v: any, k: string) {
                    setter(el, k, me.toUnit(k, v));
                });
            }
        }

        /**
         * Given the value it converts px value to a number, otherwise it returns the original
         * value.
         */
        fromUnit(value: any): any {
            var me = this;
            if (value !== null && me.pixelRe.test(value)) {
                value = parseFloat(value.replace(me.UNIT, ''));
            }
            return value;
        }

        /**
         * Checks and converts the value to px based on the given key
         */
        toUnit(key: string, value: any) {
            var me = this;
            if (value !== null && me.unitPropertyRe.test(key) && !me.unitTypeRe.test(value)) {
                value = value + me.UNIT;
            }
            return value;
        }

        /**
         * Utility to create a HTMLElement based on ICreateElement specification.
         * This utility also can assign event listeners, styles, css classes, and
         * create child elements.
         */
        createElement(config: ICreateElement, elCallback?: Function, elCallbackScope?: any): HTMLElement {
            var me = this;
            if (Blend.isObject(config)) {
                var el: HTMLElement = document.createElement(config.tag || 'div');
                for (var cfg in config) {
                    var val: any = (<any>config)[cfg];
                    if (cfg !== 'tag' && cfg !== 'scope' && cfg !== 'oid') {
                        if (cfg === 'cls') {
                            cfg = 'class';
                            if (Blend.isArray(val)) {
                                val = <Array<string>>val.join(' ');
                            }
                        } else if (cfg === 'text') {
                            cfg = null;
                            var textNd = document.createTextNode(val);
                            el.appendChild(textNd);
                        } else if (cfg === 'listeners' && Blend.isObject(val)) {
                            cfg = null;
                            for (var e in val) {
                                var handler = val[e];
                                me.addEventListener(el, e, function() {
                                    handler.apply(config.scope || window, arguments);
                                });
                            }
                        } else if (cfg === 'children') {
                            if (!Blend.isArray(val)) {
                                val = [val];
                            }
                            val.forEach(function(child: HTMLElement|ICreateElement) {
                                if (child instanceof HTMLElement) {
                                    el.appendChild(<HTMLElement>child);
                                } else {
                                    el.appendChild(me.createElement(<ICreateElement>child, elCallback, elCallbackScope));
                                }
                            });
                            cfg = null;
                        } else if (cfg === 'extra') {
                            Blend.forEach(val, function(v: any, k: string) {
                                el.setAttribute(k, v);
                            });
                            cfg = null;
                        } else if (cfg === 'style') {
                            cfg = null;
                            me.setStyle(el, <IStyleConfig>val);
                        } else if (cfg == 'unselectable') {
                            if (val === true) {
                                val = 'on';
                            } else {
                                cfg = null;
                            }
                        }
                        if (cfg) {
                            el.setAttribute(cfg, val);
                        }
                    }
                }
                if (elCallback && config.oid) {
                    elCallback.apply(elCallbackScope || window, [el, config.oid]);
                }
                return el;
            } else {
                return null;
            }
        }
    }
}

module Blend {
    /**
     * The Dom object available from Blend.Dom
     */
    export var Dom = new Blend.dom.DomSingleton();
}