/// <reference path="../Layout.ts" />
/// <reference path="Box.ts" />
module Blend.layout.container.box {

    export class Vertical extends Blend.layout.container.box.Box {

        constructor(config: IBoxLayoutConfig, view: Blend.ui.View) {
            super(config, view);
        }

        handleLayout(itemCtxList: Array<IBoxItemContext>, layoutContext: IBoxLayoutContext) {
            Blend.layout.utils.vboxUtil(itemCtxList, layoutContext);
        }

    }
}
Blend.registerClassWithAlias('layout.vhox', Blend.layout.container.box.Vertical);