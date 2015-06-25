///<reference path="../Blend.ts"/>
///<reference path="../utils/Dom.ts"/>
///<reference path="./container/box/VBoxProcessor.ts"/>
///<reference path="./container/box/HBoxProcessor.ts"/>

module Blend {

    export enum IBoxLayoutPack {
        start,
        center,
        end
    }

    export enum IBoxLayoutAlign {
        start,
        stretch,
        center,
        end
    }

    export enum IBoxLayoutDirection {
        LeftToRight,
        RightToLeft,
        TopToBottom,
        BottomToTop
    }

    export interface IBoxItemContext {
        flex: boolean;
        flexSize: number;
        itemIndex: number;
        top: number;
        left: number;
        width: number;
        height: number|string;
        css: Array<string>;
    }

    export interface IBoxLayoutContext {
        pack?: IBoxLayoutPack;
        align?: IBoxLayoutAlign;
        margin?: IBoxLayoutItemMargin|number;
        direction?: IBoxLayoutDirection;
        scroll?: boolean;
        handler?: Function;
        bounds: IBoxLayoutBounds;
    }

    export interface IBoxLayoutBounds {
        top: number;
        left: number;
        width: number;
        height: number;
    }

    export interface IBoxLayoutItemMargin {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }



}

module Blend.layout.utils {

    export function hboxUtil(ilctx: Array<IBoxItemContext>, lctx: IBoxLayoutContext) {
        var processor = new Blend.layout.container.box.HBoxProcessor();
        processor.proccess(ilctx, lctx);
    }

    export function vboxUtil(ilctx: Array<IBoxItemContext>, lctx: IBoxLayoutContext) {
        var processor = new Blend.layout.container.box.VBoxProcessor();
        processor.proccess(ilctx, lctx);
    }
}