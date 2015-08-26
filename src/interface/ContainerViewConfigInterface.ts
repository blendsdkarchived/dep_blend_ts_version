/// <reference path="ViewConfigInterface" />
/// <reference path="ComponentConfigInterface" />
/// <reference path="../ui/View" />

enum eScroll {
    None,
    Auto,
    FixedBoth,
    FixedHorizontal,
    FixedVertical
}

interface ContainerViewConfigInterface extends ViewConfigInterface {

    views?: Array<Blend.ui.View|ComponentConfigInterface|string>
    bodyPadding?: number
    allowScroll?:eScroll
}