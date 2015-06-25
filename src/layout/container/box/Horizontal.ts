/// <reference path="../Layout.ts" />
/// <reference path="Box.ts" />
/// <reference path="../../BoxUtil.ts" />

module Blend.layout.container.box {

    export class Horizontal extends Blend.layout.container.box.Box {

        constructor(config: IBoxLayoutConfig, view: Blend.ui.View) {
            var me = this;
            super(config, view);
            me.cssKeyName = 'hbox-layout';
        }

        handleLayout(itemCtxList: Array<IBoxItemContext>, layoutContext: IBoxLayoutContext) {
            Blend.layout.utils.hboxUtil(itemCtxList,layoutContext);
        }
    }
}

Blend.registerClassWithAlias('layout.hbox', Blend.layout.container.box.Horizontal);