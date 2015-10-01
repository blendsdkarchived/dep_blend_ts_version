/// <reference path="ViewBoundsInterface" />
/// <reference path="ContainerLayoutConfigInterface" />

enum eBoxLayoutPack {
    start,
    center,
    end
}

enum eBoxLayoutAlign {
    start,
    stretch,
    center,
    end
}

enum eBoxLayoutDirection {
    LeftToRight,
    RightToLeft,
    TopToBottom,
    BottomToTop
}

interface BoxLayoutContextInterface {
    pack: eBoxLayoutPack
    align: eBoxLayoutAlign
    margin: BoxLayoutMarginInterface
    allowScroll: boolean
    bounds: ViewBoundsInterface
    direction?: eBoxLayoutDirection
    flexPerPixel?: number
}

interface BoxLayoutItemContextInterface extends ViewBoundsInterface {
    flex: boolean
    flexSize: number
    marginBefore: number
    marginAfter: number
}


interface BoxLayoutMarginInterface {
    top?: number
    right?: number
    bottom?: number
    left?: number
}

interface BoxLayoutConfigInterface extends ContainerLayoutConfigInterface {
    pack?: eBoxLayoutPack
    align?: eBoxLayoutAlign
    defaultItemMargin?: BoxLayoutMarginInterface
    direction?: eBoxLayoutDirection
    allowScroll?: boolean
}