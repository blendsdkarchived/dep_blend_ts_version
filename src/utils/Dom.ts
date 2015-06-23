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
            style?: IStyleConfig;
        }

        export interface IStyleConfig {
            [name: string]: string|number;
        }

        export class DomSingleton {

            unitPropertyRe: RegExp = /(width$|height$|size$|radius$|padding|margin$|top$|bottom$|right$|left$)/;
            unitTypeRe: RegExp = /(em$|\%$|auto)/;
            pixelRe = /px$/;
            UNIT: string = 'px';

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

            cssClass(el: HTMLElement, cls?: string|IDictionary): IDictionary {
                var me = this;
                if (cls) {
                    if (Blend.isString(cls)) {
                        var a = <string>cls;
                        cls = {}; cls[a] = true;
                    }
                    var cur = me.cssClass(el),
                        re = [], s;
                    cur = Blend.apply(cur, cls, true);
                    Blend.forEach(cur, function(v, k) {
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
                        Blend.forEach(value.split(' '), function(cls) {
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
             * Returns a dictionary object with style information
             */
            getStyle(el: HTMLElement, styles: string[]): IStyleConfig {
                var me = this;
                if (el) {
                    var cs = window.getComputedStyle(el, null),
                        r: IStyleConfig = {};
                    Blend.forEach(styles, function(key) {
                        r[key] = me.fromUnit(cs.getPropertyValue(key));
                    });
                    return r;
                } else {
                    return null;
                }
            }

            setStyle(el: HTMLElement, styles: IStyleConfig) {
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
                        setter(el, k, me.toUnit(k, v));
                    });
                    return null;
                }
            }

            fromUnit(value: any): any {
                var me = this;
                if (value !== null && me.pixelRe.test(value)) {
                    value = parseFloat(value.replace(me.UNIT, ''));
                }
                return value;
            }

            toUnit(key: string, value: any) {
                var me = this;
                if (value !== null && me.unitPropertyRe.test(key) && !me.unitTypeRe.test(value)) {
                    value = value + me.UNIT;
                }
                return value;
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
    export var Dom = new utils.DomSingleton();
}