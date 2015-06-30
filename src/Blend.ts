/// <reference path="CommonInterfaces.ts" />

module Blend {

    var CSS_PREFIX = 'b-';
    var registry: IDictionary = {};

    /**
     * Returns enum value, either the value as number or its string representation
     */
    export function getEnumValue(objEnum: any, value: any, defaultValue?: any): any {
        var dic: IDictionary = objEnum;
        if (Blend.isNumeric(value)) {
            return dic[parseInt(value)] || Blend.getEnumValue(objEnum, defaultValue);
        } else {
            return dic[value] || Blend.getEnumValue(objEnum, defaultValue);
        }
    }

    /**
     * Copies keys and values from one object to another
     * @param {any} target
     * @param {any} source
     * @param {overwrite} overwrite a child objects or arrays
     * @param {mergeArrays} will merge arrays instead of overwriting them
     */
    export function apply(target: any, source: any, overwrite: boolean = false, mergeArrays: boolean = false): any {
        var key: any;
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

    /**
     * Wraps an object in an array if the object is not an array itself
     */
    export function wrapInArray(obj: any): Array<any> {
        return Blend.isArray(obj) ? obj : Blend.isNullOrUndef(obj) ? [] : [obj];
    }

    /**
     * Registers a class with a given alias into the class registry so we can
     * instantiate an object with createObjectWithAlias.
     */
    export function registerClassWithAlias(alias: string, clazz: Function) {
        if (!registry[alias]) {
            var creator = function(c: Function) {
                return function() {
                    var o: any = Object.create(c.prototype)
                    c.apply(o, arguments);
                    return o;
                }
            }
            registry[alias] = creator(clazz);
        } else {
            throw new Error(`A Class with alias ${alias} is already registered!`);
        }
    }

    /**
     * Get an alias from a given object. This function will look for ctype:'...'
     * key/value in an object.
     * @returns {string} ctype or null of nothing found.
     */
    export function getAlias(config: IComponentConfig) {
        return config ? (config['alias'] || config['ctype'] || null) : null;
    }

    /**
     * Creates an object based on an alias
     */
    export function createObjectWithAlias(objectConfig: IComponentConfig) {
        var alias = Blend.getAlias(objectConfig);
        if (registry[alias]) {
            return registry[alias].apply(this, objectConfig);
        } else {
            throw new Error(`No Class with alias ${alias} is registered!`);
        }
    }

    /**
     * Prefixes a CSS directive with CSS_PREFIX.
     * @returns {string/string[]}
     */
    export function cssPrefix(className: string|Array<string>, returnArray: boolean = false): string|string[] {
        var r: Array<string> = [];
        if (!Blend.isArray(className)) {
            className = <Array<string>>[className];
        }
        Blend.forEach(className, function(itm: string) {
            r.push(CSS_PREFIX + itm);
        });
        if (returnArray === true) {
            return r;
        } else {
            return r.join(' ');
        }
    };

    /**
     * Uppercases the first character in a string
     */
    export function ucFirst(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    /**
     * Checks if the given value is a number
     */
    export function isNumeric(value: any): boolean {
        // Original source: JQuery
        return value - parseFloat(value) >= 0;
    }

    /**
     * Checks if the given value is an array
     */
    export function isArray(value: any) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    /**
     * Checks if the given value is an object
     */
    export function isObject(value: any) {
        return (typeof value === "object" &&
            (typeof value !== "function" &&
                value !== null &&
                value !== undefined &&
                !Blend.isArray(value)));
    }

    /**
     * Checks if the given value is null or undefined
     */
    export function isNullOrUndef(value: any): boolean {
        return (value === null || value === undefined);
    }

    /**
     * Checks if the given value is a string
     */
    export function isString(value: any): boolean {
        return (typeof value === 'string');
    }

    /**
     * Checks if the given value is a function
     */
    export function isFunction(value: any): boolean {
        return (typeof value === 'function');
    }

    /**
     * Checks if the give value is instance of another class/function
     */
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

    /**
     * Loops though the given object (array or dictionary) and runs a callback on each item
     */
    export function forEach(obj: any, callback: Function, scope?: any) {
        if (typeof HTMLCollection === 'undefined') {
            var HTMLCollection = function() {
                //
            };
        }
        var key: any;
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
                var length: number = obj.length, key: any, el: HTMLElement;
                for (key = 0; key !== length; key++) {
                    el = obj.item(key);
                    if (key !== 'length') {
                        if (callback.call(scope, el, parseInt(key), obj) === false) {
                            break;
                        }
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
    }
}