/// <reference path="../interface/ControllerDictionaryInterface" />
/// <reference path="../interface/ModelDictionaryInterface" />
/// <reference path="Controller" />
/// <reference path="Model" />

module Blend.mvc {

    /**
     * @internal
     * Provides infrastructure to register and retrive Controllers and Models
     * for the MVC MVVM framework
     */
    export class ContextSingleton {

        private controllers: ControllerDictionaryInterface = {}
        private models: ModelDictionaryInterface = {}

        /**
         * Returns the controller dictionary of this Context
         */
        getControllers():ControllerDictionaryInterface {
            return this.controllers;
        }

        /**
         * Retrives a controller based on its name
         */
        getController(name: string): Controller {
            return this.controllers[name] || null;
        }

        /**
         * Retrives a Model based on its name
         */
        getModel(name: string): Model {
            return this.models[name] || null;
        }

        /**
         * @internal
         * Registers a Model in Context registry.
         */
        registerModel(name: string, model: Model) {
            if (!this.models[name]) {
                this.models[name] = model;
            } else {
                throw new Error(`A Model with the name [${name}] is already registered!`);
            }
        }

        /**
         * @internal
         * Registers a controller in the Context registry.
         */
        registerController(name: string, controller: Controller) {
            if (!this.controllers[name]) {
                this.controllers[name] = controller;
            } else {
                throw new Error(`A Controller with the name [${name}] is already registered!`);
            }
        }
    }

    export var Context:ContextSingleton = new ContextSingleton();
}