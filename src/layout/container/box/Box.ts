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
        private setDefaultMargins: boolean;
        protected marginBefore: number; // either left or top
        protected marginAfter: number; // either bottom or right
        protected marginProperyName: string; // either width or height

        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            super(config);
            me.pack = me.initialConfig.pack;
            me.align = me.initialConfig.align;
            me.splitter = me.initialConfig.splitter;
            me.defaultItemMargin = me.initialConfig.defaultItemMargin;
            me.direction = me.initialConfig.direction;
            me.allowScroll = true;
            me.setDefaultMargins = me.hasMargins(me.defaultItemMargin);
        }

        /**
         * Check if the a given margins value is set
         */
        private hasMargins(margins: BoxLayoutItemMarginInterface) {
            return ((margins.top || 0) + (margins.right || 0) + (margins.bottom || 0) + (margins.left || 0)) !== 0;
        }

        /**
         * Creates margins for a given view by placing placers before and after.
         */
        protected createViewMargins(view: Blend.ui.View, margins: BoxLayoutItemMarginInterface): Array<Blend.ui.View> {
            var me = this,
                views: Array<Blend.ui.View> = [];
            if (me.marginBefore !== 0) {
                views.push(me.createSpacer(me.marginBefore));
            }
            views.push(view);
            if (me.marginAfter !== 0) {
                views.push(me.createSpacer(me.marginAfter));
            }
            return views;
        }

        private createSpacer(size: number) {
            var me = this, spacer: any = {
                ctype: 'ui.spacer'
            }
            spacer[me.marginProperyName] = size;
            return me.createChildView(spacer)[0];
        }


        createChildViews(childViews: Array<Blend.ui.View|ComponentConfigInterface|string>): Array<Blend.ui.View> {
            var me = this, views: Array<Blend.ui.View> = [],
                tmp = super.createChildViews(childViews),
                margins: BoxLayoutItemMarginInterface = null;

            Blend.forEach(tmp, function(view: Blend.ui.View) {

                margins = view.getAttribute<BoxLayoutItemMarginInterface>('margins');
                if (!margins && me.setDefaultMargins === true) {
                    margins = me.defaultItemMargin;
                }

                if (margins) {
                    views = views.concat(me.createViewMargins(view, margins));
                } else {
                    views.push(view);
                }

            });
            return views;
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
                var ctx: any = {},
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

        handleLayout(itemCtxList: Array<BoxItemContextInterface>, layoutContext: BoxLayoutContextInterface) {
            throw Error('handleLayout not yet implemented');
        }

        protected alignAndPack() {
            throw Error('alignAndPack not yet implemented');
        }

    }
}