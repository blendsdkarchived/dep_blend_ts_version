/// <reference path="../../../Blend" />
/// <reference path="../../../interface/BoxLayoutInterface" />
/// <reference path="../../utils/box/BoxProcessor" />
/// <reference path="../Layout" />
/// <reference path="../../../ui/splitter/Splitter" />
/// <reference path="../../../ui/splitter/Manager" />

module Blend.layout.container.box {

    /**
     * Base class for HBox and VBox layouts
     */
    export class Box extends Blend.layout.container.Layout {

        protected pack: eBoxLayoutPack;
        protected align: eBoxLayoutAlign;
        protected splitter: boolean;
        protected direction: eBoxLayoutDirection;
        protected defaultItemMargin: BoxLayoutMarginInterface;
        protected initialConfig: BoxLayoutConfigInterface;

        protected itemContext: Array<BoxItemContextInterface>
        protected layoutContext: BoxLayoutContextInterface;
        protected viewsInLayout: Array<Blend.ui.View>;
        protected boxProcessor: BoxProcessor;

        private allowScroll: boolean;
        private setDefaultMargins: boolean;
        private usedMargins: boolean;
        private usedSplitter: boolean;
        private spLastView: Blend.ui.View;

        protected marginBefore: number; // either left or top
        protected marginAfter: number; // either bottom or right
        protected marginProperyName: string; // either width or height
        protected splitterType: string; // either h or v
        protected splitManager: Blend.ui.splitter.Manager


        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            super(config);
            me.pack = me.initialConfig.pack;
            me.align = me.initialConfig.align;
            me.defaultItemMargin = me.initialConfig.defaultItemMargin;
            me.direction = me.initialConfig.direction;
            me.allowScroll = true;
            me.setDefaultMargins = me.usedMargins = me.hasMargins(me.defaultItemMargin);
            me.usedSplitter = false;
        }

        /**
         * Check if the a given margins value is set
         */
        private hasMargins(margins: BoxLayoutMarginInterface) {
            return (margins ? ((margins.top || 0) + (margins.right || 0) + (margins.bottom || 0) + (margins.left || 0)) : 0) !== 0;
        }

        /**
         * Creates margins for a given view by placing placers before and after.
         */
        protected createViewMargins(view: Blend.ui.View, margins: BoxLayoutMarginInterface): Array<Blend.ui.View> {
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

        /**
         * Creates a spacer View to be used as margins
         */
        private createSpacer(size: number) {
            var me = this, spacer: any = {
                ctype: 'ui.spacer'
            }
            spacer[me.marginProperyName] = size;
            return me.createChildView(spacer)[0];
        }

        private createSplitter() {
            var me = this, splitter: any = {
                ctype: 'ui.splitter',
                splitType: me.splitterType,

            }
            return me.createChildView(splitter)[0];
        }

        /**
         * Loops thoigh the provided views for processing margins and splitters
         */
        createChildViews(childViews: Array<Blend.ui.View|ComponentConfigInterface|string>): Array<Blend.ui.View> {
            var me = this, views: Array<Blend.ui.View> = [],
                tmp = super.createChildViews(childViews)
            Blend.forEach(tmp, function(view: Blend.ui.View, index: number) {
                if (me.usedSplitter === true) {
                    views = me.processSplitters(view, index, views, tmp.length);
                } else {
                    views = me.processMargins(view, views);
                }
            });
            me.usedMargins = true;
            return views;
        }

        createChildView(childView: Blend.ui.View|ComponentConfigInterface|string): Array<Blend.ui.View> {
            var me = this,
                views: Array<Blend.ui.View> = super.createChildView(childView),
                view = views[0];
            if (me.usedMargins === false) {
                me.usedMargins = view.getInitialConfig<BoxLayoutMarginInterface>('margins') ? true : false;
            }
            if (me.usedSplitter === false) {
                me.usedSplitter = view.getInitialConfig<boolean>('split') || false;
            }
            return views;
        }


        /**
         * Addes margins before or after a View
         */
        protected processMargins(view: Blend.ui.View, views: Array<Blend.ui.View>) {
            var me = this,
                margins: BoxLayoutMarginInterface = null;

            margins = view.getInitialConfig<BoxLayoutMarginInterface>('margins');
            if (!margins && me.setDefaultMargins === true) {
                margins = me.defaultItemMargin;
            }
            if (margins) {
                views = views.concat(me.createViewMargins(view, margins));
            } else {
                views.push(view);
            }
            return views;
        }

        /**
         * Adds splitters before or after a View
         */
        protected processSplitters(view: Blend.ui.View, viewIndex: number, views: Array<Blend.ui.View>, numViews: number) {
            var me = this, strategy: string;
            var hasSplitter: boolean = view.getInitialConfig<boolean>('split') || false;
            if (hasSplitter && numViews > 1) {
                me.initSplitManager();
                var isFirst = viewIndex === 0;
                var isLast = viewIndex === numViews - 1;
                var isLastViewSplitter = Blend.isInstanceOf(me.spLastView, Blend.ui.splitter.Splitter);

                if (isFirst) {
                    strategy = 'vs';
                } else if (isLast && isLastViewSplitter === false) {
                    strategy = 'sv';
                } else if (!isFirst && !isLast) {
                    if (isLastViewSplitter === true) {
                        strategy = 'vs';
                    } else {
                        strategy = 'sv';
                    }
                }

                if (strategy === 'vs') {
                    views.push(view);
                    views.push(me.createSplitter())
                } else if(strategy == 'sv') {
                    views.push(me.createSplitter())
                    views.push(view);
                } else {
                    views.push(view);
                }

            } else {
                views.push(view);
            }
            me.spLastView = views[views.length - 1];
            return views;
        }

        /**
         * Lazy initialisation of the splitManager
         */
        private initSplitManager() {
            var me = this;
            if (!me.splitManager) {
                me.splitManager = new Blend.ui.splitter.Manager();
            }
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                pack: eBoxLayoutPack.start,
                align: eBoxLayoutAlign.start,
                splitter: false,
                direction: null,
                defaultItemMargin: <BoxLayoutMarginInterface> {
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
            Blend.forEach(me.itemContext, function(ctx: BoxItemContextInterface, idx: number) {
                setTimeout(function() {
                    var view = me.viewsInLayout[idx];
                    view.setAttribute('flexPerPixel', me.layoutContext.flexPerPixel);
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
                bounds: any = Blend.Dom.getBounds(me.getViewBodyContentElement())

            if (me.usedSplitter === true) {
                /**
                 * Make sure the View are stretched when a splitter is used
                 */
                me.align = eBoxLayoutAlign.stretch;
            }

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

    }
}