/// <reference path="ViewConfigInterface" />
/// <reference path="ComponentConfigInterface" />
/// <reference path="ContainerLayoutConfigInterface" />
/// <reference path="../ui/View" />

enum eScroll {
    None,
    Auto,
    FixedBoth,
    FixedHorizontal,
    FixedVertical
}

interface ContainerConfigInterface extends ViewConfigInterface {
    views?: Array<Blend.ui.View|ComponentConfigInterface|string>
    layout?: string|ContainerLayoutConfigInterface
}