///<reference path="../Blend.ts"/>
///<reference path="../Environment.ts"/>
module Blend {
    export module utils {

        export interface ICreateElementListeners {
            [name: string]: EventListener
        }

        export interface ICreateElement {
            tag?: string;
            scope?: any;
            oid?: string;
            cls?: string|Array<string>;
            listeners?: ICreateElementListeners;
            text?: string;
            children?: Array<ICreateElement|HTMLElement>,
            extra?: any;
        }

        export interface IStyleConfig {
            [name: string]: string|number;
        }

        export class DomSingleton {

            unitPropertyRe: RegExp = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
            unitTypeRe: RegExp = /(em$|\%$)/;
            UNIT: string = 'px';


            getDocument(): HTMLElement {
                if (document) {
                    return document.documentElement;
                } else {
                    throw new Error('No document object available!');
                }
            }

            clearElement(el: HTMLElement) {
                var me = this;
                if (el) {
                    while (el.firstChild) {
                        el.removeChild(el.firstChild);
                    }
                }
            }

            addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
                el.addEventListener(eventName, eventHandler, false);
            }

            removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
                el.removeEventListener(eventName, eventHandler, false);
            }

            style(el: HTMLElement, styles?: IStyleConfig): CSSStyleDeclaration {
                var me = this,
                    setter = function(el, k, v) {
                        if (v === null) {
                            el.style.removeProperty(k);
                        } else {
                            if (Blend.Environment.isIE) {
                                el.style[k] = v;
                            } else {
                                el.style.setProperty(k, v);
                            }
                        }
                    };

                if (styles) {
                    Blend.forEach(styles, function(v, k) {
                        if (v !== null && me.unitPropertyRe.test(k) && !me.unitTypeRe.test(v)) {
                            v = v + me.UNIT;
                        }
                        setter(el, k, v);
                    });
                    return null;
                } else {
                    return window.getComputedStyle(el, null);
                }
            }

            createElement(config: ICreateElement, elCallback?: Function, elCallbackScope?: any): HTMLElement {
                var me = this;
                if (Blend.isObject(config)) {
                    var el: HTMLElement = document.createElement(config.tag || 'div');
                    for (var cfg in config) {
                        var val = config[cfg];
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
                                val.forEach(function(child) {
                                    if (child instanceof HTMLElement) {
                                        el.appendChild(<HTMLElement>child);
                                    } else {
                                        el.appendChild(me.createElement(child, elCallback, elCallbackScope));
                                    }
                                });
                                cfg = null;
                            } else if (cfg === 'extra') {
                                Blend.forEach(val, function(v, k) {
                                    el.setAttribute(k, v);
                                });
                                cfg = null;
                            } else if (cfg === 'style') {
                                cfg = null;
                                me.style(el, <IStyleConfig>val);
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
    export var Dom = new utils.DomSingleton();
}