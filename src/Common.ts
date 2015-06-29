/**
 * Interface for implementing dictionary like objects
 */
interface IDictionary {
    [name: string]: any;
}

/**
 * Interface for describing styles
 */
interface IStyleConfig {
    [name: string]: string|number;
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
    tag?: string;
    scope?: any;
    oid?: string;
    cls?: string|Array<string>;
    listeners?: ICreateElementListeners;
    text?: string;
    children?: Array<ICreateElement|HTMLElement>;
    extra?: any;
    style?: IStyleConfig;
}