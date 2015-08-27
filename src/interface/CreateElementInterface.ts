/// <reference path="CreateElementListenersInterface" />
/// <reference path="StyleConfigiInterface" />

/**
 * Interface for the Dom.createElement utility
 */
interface CreateElementInterface {
    tag?: string
    scope?: any
    oid?: string
    cls?: string|Array<string>
    listeners?: CreateElementListenersInterface
    text?: string
    children?: Array<CreateElementInterface|HTMLElement>
    extra?: any
    style?: StyleConfigiInterface
}