/// <reference path="CommonInterfaces.ts" />
/// <reference path="Blend.ts" />

module Blend {
    /**
     * Base class for Components.
     */
    export class Component {

        /**
         * Sets a dynamic attribute to this Component
         */
        setAttribute(name:string,value:any) {
            var me:any = this;
            me[name] = value;
        }

        /**
         * Check if this Component implements a function
         */
        hasFunction(fname: string) {
            var me: any = this;
            return !Blend.isNullOrUndef(me[fname]) && Blend.isFunction(me[fname]);
        }

        /**
         * Dynamically run a function within this Component
         */
        applyFunction(name: string, args: Array<any>|IArguments): any {
            var me: any = this,
                fn: Function = <Function>me[name];
            if (Blend.isFunction(fn)) {
                return fn.apply(me, args);
            } else {
                throw new Error(`Class method [${name}] does not exist!`);
            }
        }
    }
}