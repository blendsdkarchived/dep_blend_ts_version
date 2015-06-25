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
        css:Array<string>;
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

    /**
     * hboxUtil and vboxUtil use internal processors to layouts elements
     * based on their layout context. We instantiate these objects only
     * when we really need them.
     */

    export var _hboxProcessor: Blend.layout.container.box.HBoxProcessor;
    export var _vboxProcessor: Blend.layout.container.box.VBoxProcessor;

    export function hboxUtil(ilctx: Array<IBoxItemContext>, lctx: IBoxLayoutContext) {
        if (!Blend.layout.utils._hboxProcessor) {
            Blend.layout.utils._hboxProcessor = new Blend.layout.container.box.HBoxProcessor();
        }
         Blend.layout.utils._hboxProcessor.proccess(ilctx,lctx);
    }

    export function vboxUtil(ilctx: Array<IBoxItemContext>, lctx: IBoxLayoutContext) {
        if (!Blend.layout.utils._vboxProcessor) {
            Blend.layout.utils._vboxProcessor = new Blend.layout.container.box.VBoxProcessor();
        }
        Blend.layout.utils._vboxProcessor.proccess(ilctx,lctx);
    }
}