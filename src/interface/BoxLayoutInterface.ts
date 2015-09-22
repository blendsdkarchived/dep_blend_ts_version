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
    // Nice to have feature
    //TopToBottom,
    //BottomToTop
}

interface BoxItemContextInterface {
    flex: boolean
    flexSize: number
    itemIndex: number
    top: number
    left: number
    width: number|string
    height: number|string
    css: Array<string>
}

interface BoxLayoutContextInterface {
    pack?: eBoxLayoutPack,
    align?: eBoxLayoutAlign,
    margin?: BoxLayoutMarginInterface
    direction?: eBoxLayoutDirection
    allowScroll:boolean,
    handler?: Function
    bounds: BoxLayoutBoundsInterface
}

interface BoxLayoutBoundsInterface {
    top: number
    left: number
    width: number
    height: number
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
    direction?: eBoxLayoutDirection
    defaultItemMargin?: BoxLayoutMarginInterface
}