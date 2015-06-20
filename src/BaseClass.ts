///<reference path="Blend.ts"/>
module Blend {	
    /**
     * The base class for most BlendJS components. This class accepts a dictionary
     * as its constructor parameter. For each key/value pare in in the doctionary 
     * the parseConfigValue value is called before the value is assigned to the class.
     * Additionaly if the class contains a setter function for a given key (setXYZ), then
     * the setter function is used to assign the value. 
     */
    export class BaseClass {

        constructor(config?: any) {
            var me = this,
                setterFnName: string,
                value: any;
            if (config) {
                for (var key in config) {
                    if (config[key]) {
                        setterFnName = 'set' + Blend.ucFirst(key);
                        value = this.parseConfigValue(key, config[key]);
                        if (me[setterFnName]) {
                            me[setterFnName].apply(me, [value]);
                        } else {
                            me[key] = value;
                        }
                    }
                }
            }
        }
        
        /**
         * Parses a given configuration value before it is assigned to the vurrent class
         */
        parseConfigValue(key: string, value: any) {
            return value;
        }
    }
}