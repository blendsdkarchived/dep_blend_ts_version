/// <reference path="../../../Blend" />
/// <reference path="../../../interface/BoxLayoutInterface" />
/// <reference path="../../utils/box/BoxProcessor" />
/// <reference path="../Layout" />



module Blend.layout.container.box {

    /**
     * Base class for HBox and VBox layouts
     */
    export class Box extends Blend.layout.container.Layout {

        protected pack: eBoxLayoutPack;
        protected align: eBoxLayoutAlign;
        protected splitter: boolean;
        protected direction: eBoxLayoutDirection;
        protected defaultItemMargin: BoxLayoutItemMarginInterface;
        protected initialConfig: BoxLayoutConfigInterface;

        protected itemContext: Array<BoxItemContextInterface>
        protected layoutContext: BoxLayoutContextInterface;
        protected viewsInLayout: Array<Blend.ui.View>;
        protected boxProcessor: BoxProcessor;

        private allowScroll: boolean;



        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            super(config);
            me.pack = me.initialConfig.pack;
            me.align = me.initialConfig.align;
            me.splitter = me.initialConfig.splitter;
            me.defaultItemMargin = me.initialConfig.defaultItemMargin;
            me.direction = me.initialConfig.direction;
            me.allowScroll = true;
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                pack: eBoxLayoutPack.start,
                align: eBoxLayoutAlign.start,
                splitter: false,
                direction: null,
                defaultItemMargin: <BoxLayoutItemMarginInterface> {
                    bottom: 0,
                    left: 0,
                    top: 0,
                    right: 0
                }
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        handleLayout(itemCtxList: Array<BoxItemContextInterface>, layoutContext: BoxLayoutContextInterface) {
            throw Error('handleLayout not yet implemented');
        }

        protected alignAndPack() {
            throw Error('alignAndPack not yet implemented');
        }

        performLayout() {
            var me = this;
            me.itemContext = me.createItemLayoutContext();
            me.layoutContext = me.createLayoutContext();
            me.handleLayout(me.itemContext, me.layoutContext);
            me.alignAndPack();
            Blend.forEach(me.itemContext, function(ctx: BoxItemContextInterface, idx: number) {
                setTimeout(function() {
                    var view = me.viewsInLayout[idx];
                    /**
                     * This will trigger the view's native performLayout instead
                     * of view's parent's performLayout which is the default behaviour
                     * when a views is asked to do layout.
                     */
                    view.placeInALayoutContext(true);
                    view.setBounds(ctx);
                    view.placeInALayoutContext(false);
                }, 5);
            })
            me.view.doneLayout();
        }

        createLayoutContext(): BoxLayoutContextInterface {
            var me = this,
                bounds: any = Blend.Dom.getStyle(me.getViewBodyContentElement(), ['top', 'left', 'width', 'height'])
            return {
                pack: me.pack,
                align: me.align,
                itemMargin: me.defaultItemMargin,
                direction: me.direction,
                bounds: <BoxLayoutBoundsInterface>bounds,
                allowScroll: me.allowScroll
            };
        }

        /**
         * Loop through the visible view children and create a layout context
         * for each one. The layout context contains the view bounds and the
         * flex size information
         */
        createItemLayoutContext(): Array<BoxItemContextInterface> {
            var me = this,
                list: Array<BoxItemContextInterface> = [];
            me.viewsInLayout = me.getVisibleViewItems();
            Blend.forEach(me.viewsInLayout, function(view: Blend.ui.View) {
                var ctx: any = {
                    margin: view.getInitialConfig('margin') || me.defaultItemMargin,
                    split: view.getInitialConfig('split') || false,
                },
                    flex = view.getInitialConfig('flex');
                Blend.apply(ctx, view.getBounds());
                if (flex) {
                    ctx.flex = true;
                    me.allowScroll = false;
                    ctx.flexSize = <number>flex;
                } else {
                    ctx.flex = false;
                    ctx.flexSize = 0;
                }
                list.push(<BoxItemContextInterface>ctx);
            });
            return list;
        }
    }
}