/// <reference path="ContainerConfigInterface" />
/// <reference path="../ui/View" />


/**
 * Interface for providing configuration to a Layout component
 */
interface ContainerLayoutConfigInterface extends LayoutConfigInterface {
    views?: Array<Blend.ui.View>
}