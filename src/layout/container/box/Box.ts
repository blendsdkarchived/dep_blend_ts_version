/// <reference path="../Layout.ts" />
/// <reference path="../../BoxUtil.ts" />


module Blend.layout.container.box {

    export interface IBoxLayoutConfig extends Blend.layout.ILayoutConfig {

        pack?: Blend.IBoxLayoutPack
        align?: Blend.IBoxLayoutAlign
        splitter?: boolean;
        direction?: Blend.IBoxLayoutDirection
        defaultItemMargin?: IBoxLayoutItemMargin|number;
    }

    export class Box extends Blend.layout.container.Layout {

        pack: Blend.IBoxLayoutPack
        align: Blend.IBoxLayoutAlign
        splitter: boolean;
        direction: Blend.IBoxLayoutDirection;
        defaultItemMargin: IBoxLayoutItemMargin|number;

        itemContext: Array<IBoxItemContext>
        layoutContext: IBoxLayoutContext;

        constructor(config: IBoxLayoutConfig, view: Blend.ui.View) {
            var me = this;
            super(config, view);
            me.splitter = me.splitter || false;
            me.align = me.align || IBoxLayoutAlign.start;
            me.pack = me.pack || IBoxLayoutPack.start;
            me.defaultItemMargin = me.defaultItemMargin || 0;
        }

        handleLayout(itemCtxList: Array<IBoxItemContext>, layoutContext: IBoxLayoutContext) {
            throw Error('handleLayout not yet implemented');
        }

        performLayout() {
            var me = this;
            me.itemContext = me.createItemLayoutContext();
            me.layoutContext = me.createLayoutContext();
            me.handleLayout(me.itemContext, me.layoutContext);
            super.performLayout.apply(me, arguments);
        }

        createLayoutContext(): IBoxLayoutContext {
            var me = this;
            return {
                pack: me.pack,
                align: me.align,
                itemMargin: me.defaultItemMargin,
                direction: me.direction,
                bounds: <IBoxLayoutBounds>me.view.getBounds(),
                scroll: false, //me.view.scroll,
                handler: function(ctx, idx) {
                    var views = me.getViewVisibleChildren(),
                        view = <Blend.ui.View>views[idx];
                    view.setBounds(ctx);
                }
            };
        }

        /**
         * Loop through the visible view children and create a layout context
         * for each one. The layout context contains the view bounds and the
         * flex size information
         */
        createItemLayoutContext(): Array<IBoxItemContext> {
            var me = this,
                list: Array<IBoxItemContext> = [];
            Blend.forEach(me.getViewVisibleChildren(), function(view: Blend.ui.View) {
                var ctx: any = {},
                    flex = view.getAttribute('flex');
                Blend.apply(ctx, view.getBounds());
                if (flex) {
                    ctx.flex = true;
                    ctx.flexSize = <number>flex;
                } else {
                    ctx.flex = false;
                    ctx.flexSize = 0;
                }
                list.push(<IBoxItemContext>ctx);
            });
            return list;
        }
    }
}