/**
 * Interface for implementing dictionary like objects
 */
interface DictionaryInterface {
    [name: string]: any
}

/**
 * Interface for implementing a dictionary that can only contain
 * strings for values
 */
interface StringDictionaryInterface {
    [name: string]: string
}

/**
 * Interface for describing styles
 */
interface IStyleConfig {
    [name: string]: string|number
}

/**
 * Interface for assigning EventListeners to DOM Elements
 */
interface ICreateElementListeners {
    [name: string]: EventListener
}

/**
 * Interface for the Dom.createElement utility
 */
interface ICreateElement {
    tag?: string
    scope?: any
    oid?: string
    cls?: string|Array<string>
    listeners?: ICreateElementListeners
    text?: string
    children?: Array<ICreateElement|HTMLElement>
    extra?: any
    style?: IStyleConfig
}

/**
 * Interface for assigning configuration paremeters to a Blend class
 */
interface ComponentConfigInterface extends DictionaryInterface {
    ctype?: string
}

/**
 * Interface for implementing a controller dictionary
 */
interface IControllerDictionary {
    [name: string]: Blend.mvc.Controller
}

/**
 * Interface for implementing a model dictionary
 */
interface IModelDictionary {
    [name: string]: Blend.mvc.Model
}