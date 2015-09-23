/// <reference path="Blend" />
/// <reference path="interface/DictionaryInterface" />


module Blend {
    /**
     * Base class for Components.
     */
    export class Component {

        protected initialConfig: DictionaryInterface

        constructor(config?: any) {
            var me = this;
            me.initialConfig = me.initConfig(config);
        }

        protected initConfig(config: DictionaryInterface = {}) {
            return config || {};
        }

        /**
         * Sets a list of dynamic attributes to this Component
         */
        setAttributes(attrs: DictionaryInterface) {
            var me = this;
            Blend.forEach(attrs, function(value: any, key: string) {
                me.setAttribute(key, value);
            });
        }

        /**
         * Sets a dynamic attribute to this Component
         */
        setAttribute(name: string, value: any) {
            var me: any = this;
            me[name] = value;
        }

        /**
         * Retrives a value from the initial config
         */
        getInitialConfig<T>(name: string): T {
            var me: any = this;
            return (Blend.isNullOrUndef(me.initialConfig[name]) ? null : me.initialConfig[name]);
        }

        /**
         * Retrives a value from the initial config. This function is only usefull for internal handling
         * of the layout system and should not be used anywhere else.
         */
        setInitialConfig<T>(name: string, value: any) {
            var me: any = this;
            me.initialConfig[name] = value;
        }

        /**
         * Retrives the value of a dynamic attribute within this Component
         */
        getAttribute<T>(name: string): T {
            var me: any = this;
            return (Blend.isNullOrUndef(me[name]) ? null : me[name]);
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