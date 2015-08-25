/// <reference path="../../CommonInterfaces.ts" />

/**
 * Interface for defining a Spacer widget to be used in containers with
 * box layouts and Toolbar components
 */
interface SpacerInterface extends IDictionary {
    /**
     * Size in pixels
     */
    size?:number
    /**
     * Size in flex units
     */
    flex?:number
}