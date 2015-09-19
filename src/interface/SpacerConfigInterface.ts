/// <reference path="ViewConfigInterface" />

/**
 * Interface for defining a Spacer widget to be used in containers with
 * box layouts and Toolbar components
 */
interface SpacerConfigInterface extends ViewConfigInterface {
    /**
     * Size in pixels
     */
    size?:number
    /**
     * Size in flex units
     */
    flex?:number
}