/// <reference path="ViewConfigInterface" />
/// <reference path="ComponentConfigInterface" />
/// <reference path="../ui/View" />

/**
 * Interface for defining an application config
 */
interface ApplicationConfigInterface extends ViewConfigInterface {
    mainView: Blend.ui.View|ComponentConfigInterface|string
}
