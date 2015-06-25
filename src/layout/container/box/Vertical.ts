/// <reference path="../Layout.ts" />
/// <reference path="Box.ts" />
module Blend.layout.container.box {

    export class Vertical extends Blend.layout.container.box.Box {

        constructor(config: IBoxLayoutConfig, view: Blend.ui.View) {
            var me = this;
            super(config, view);
            me.cssKeyName = 'vbox-layout';
        }

        handleLayout(itemCtxList: Array<IBoxItemContext>, layoutContext: IBoxLayoutContext) {
            Blend.layout.utils.vboxUtil(itemCtxList, layoutContext);
        }

    }
}
Blend.registerClassWithAlias('layout.vbox', Blend.layout.container.box.Vertical);