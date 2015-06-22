/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 BLENDJS.COM TrueSoftware B.V. (The Netherlands)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
module Blend {

    var CSS_PREFIX = 'b-';
    var registry = {};

    export interface IDictionary {
        [name: string]: any;
    }

    export interface IClassWithAliasConfig {
        ctype: string;
        [name: string]: any;
    }

    export function apply(target: any, source: any, overwrite: boolean = false, mergeArrays: boolean = false) {
        var key;
        overwrite = overwrite || false;
        mergeArrays = mergeArrays || false;
        if (target && source) {
            for (key in source) {
                if (key) {
                    if (target[key] && Blend.isObject(target[key])) {
                        if (overwrite) {
                            target[key] = source[key];
                        } else {
                            Blend.apply(target[key], source[key]);
                        }
                    } else if (target[key] && Blend.isArray(target[key]) && mergeArrays === true) {
                        target[key] = target[key].concat(Blend.wrapInArray(source[key]));
                    } else if (target[key] && overwrite) {
                        target[key] = source[key];
                    } else if (Blend.isNullOrUndef(target[key])) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    }

    export function wrapInArray(obj: any): Array<any> {
        return Blend.isArray(obj) ? obj : Blend.isNullOrUndef(obj) ? [] : [obj];
    }

    export function registerClassWithAlias(alias: string, clazz: Function) {
        if (!registry[alias]) {
            var creator = function(c: Function) {
                return function() {
                    var o = Object.create(c.prototype)
                    c.apply(o, arguments);
                    return o;
                }
            }
            registry[alias] = creator(clazz);
        } else {
            throw new Error(`A Class with alias ${alias} is already registered!`);
        }
    }

    export function getAlias(config: any) {
        return config ? (config['alias'] || config['ctype'] || null) : null;
    }

    export function createObjectWithAlias(alias: string, ...args: any[]) {
        if (registry[alias]) {
            return registry[alias].apply(this, args);
        } else {
            throw new Error(`No Class with alias ${alias} is registered!`);
        }
    }

    export function cssPrefix(className: string|Array<string>): string {
        var r = [];
        if (!Blend.isArray(className)) {
            className = <Array<string>>[className];
        }
        Blend.forEach(className, function(itm) {
            r.push(CSS_PREFIX + itm);
        });
        return r.join(' ');
    };

    export function ucFirst(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    export function isArray(value: any) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    export function isObject(value: any) {
        return (typeof value === "object" &&
            (typeof value !== "function" &&
                value !== null &&
                value !== undefined &&
                !Blend.isArray(value)));
    }

    export function isNullOrUndef(value: any): boolean {
        return (value === null || value === undefined);
    }

    export function isString(value: any): boolean {
        return (typeof value === 'string');
    }

    export function isFunction(value: any): boolean {
        return (typeof value === 'function');
    }

    export function isInstanceOf(obj: any, clazz: any): boolean {
        var hc = '[object HTMLCollection]';
        if (obj.toString() === hc && clazz === 'HTMLCollection') {
            return true;
        } else {
            if (Blend.isString(clazz)) {
                var fn = new Function('', ' try { return ' + clazz + ' } catch(e) { return null };');
                clazz = fn();
            }
            try {
                var res = (obj instanceof clazz);
                return res;
            } catch (e) {
                return false;
            }
        }
    }

    export function forEach(obj: any, callback: Function, scope?: any) {
        if (typeof HTMLCollection === 'undefined') {
            var HTMLCollection = function() {
                //
            };
        }
        var key;
        if (obj) {
            if (Blend.isFunction(obj)) {
                for (key in obj) {
                    if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
                        if (callback.call(scope, obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            } else if (Blend.isArray(obj)) {
                for (key = 0; key < obj.length; key++) {
                    if (callback.call(scope, obj[key], parseInt(key), obj) === false) {
                        break;
                    }
                }
            } else if (Blend.isInstanceOf(obj, 'HTMLCollection')) {
                var length = obj.length, key, el;
                for (key = 0; key !== length; key++) {
                    el = obj.item(key);
                    if (callback.call(scope, el, key, obj) === false) {
                        break;
                    }
                }
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (callback.call(scope, obj[key], key, obj) === false) {
                            break;
                        }
                    }
                }
            }
        }
        return obj;
    }
}