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
        viewsInLayout:Array<Blend.ui.View>;

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
            Blend.forEach(me.itemContext,function(ctx,idx){
                setTimeout(function(){
                    var view = me.viewsInLayout[idx];
                    /**
                     * This will trigger the view's navite performLayout instead
                     * of view's parent's performLayout which is the default behaviour
                     * when a views is asked to  do layout.
                     */
                    view.placeInALayoutContext(true);
                    view.setBounds(ctx);
                    view.placeInALayoutContext(false);
                },5);
            })
            me.view.doneLayout();
        }

        createLayoutContext(): IBoxLayoutContext {
            var me = this;
            return {
                pack: me.pack,
                align: me.align,
                itemMargin: me.defaultItemMargin,
                direction: me.direction,
                bounds: <IBoxLayoutBounds>me.view.getBounds(),
                scroll: false
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
                me.viewsInLayout = me.getViewVisibleChildren();
            Blend.forEach(me.viewsInLayout, function(view: Blend.ui.View) {
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