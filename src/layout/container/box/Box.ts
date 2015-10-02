/// <reference path="BoxProcessor" />
/// <reference path="../Layout" />
/// <reference path="../../../ui/Splitter" />
/// <reference path="../../../interface/BoxLayoutInterface" />


module Blend.layout.container.box {

    export class Box extends Blend.layout.container.Layout {

        protected initialConfig: BoxLayoutConfigInterface;
        protected boxProcessor: BoxProcessor;
        protected boxedProperty: string;
        protected sizeProperty: string;
        protected marginBeforeProperty: string;
        protected marginAfterProperty: string;
        private calculateMargins: boolean;

        constructor(config: BoxLayoutConfigInterface) {
            var me = this;
            me.calculateMargins = true;
            super(config);
        }

        /**
         * @override
         */
        performLayout() {
            var me = this;
            var layoutContext = me.createLayoutContext();
            var itemsLayoutContext = me.createItemsLayoutContext(layoutContext);
            me.boxProcessor.calculate(itemsLayoutContext, layoutContext);

            Blend.forEach(itemsLayoutContext, function(ctx: BoxLayoutItemContextInterface, index: number) {
                //setTimeout(function() {
                var view = me.childViews[index];
                view.setAttribute('flexPerPixel', layoutContext.flexPerPixel);
                /**
                 * This will trigger the view's native performLayout instead
                 * of view's parent's performLayout which is the default behaviour
                 * when a views is asked to do layout.
                 */
                view.placeInALayoutContext(true);
                view.setBounds(ctx);
                view.placeInALayoutContext(false);
                //}, 5);
            })
            me.view.doneLayout();
        }

        private createItemsLayoutContext(layoutContext: BoxLayoutContextInterface): Array<BoxLayoutItemContextInterface> {
            var me = this,
                result: Array<BoxLayoutItemContextInterface> = [],
                mrgBefore: number,
                mrgAfter: number,
                flex: number,
                viewBounds: ViewBoundsInterface,
                ctx: BoxLayoutItemContextInterface,
                margins: BoxLayoutMarginInterface;

            Blend.forEach(me.childViews, function(view: Blend.ui.View, index: number) {
                viewBounds = view.getBounds();
                mrgBefore = mrgAfter = 0;
                if (me.calculateMargins) {
                    margins = view.getInitialConfig<BoxLayoutMarginInterface>('margins') || me.initialConfig.defaultItemMargin || null;
                    if (margins !== null) {
                        mrgBefore = (<any>margins)[me.marginBeforeProperty] || 0;
                        mrgAfter = (<any>margins)[me.marginAfterProperty] || 0;
                    }
                }

                flex = view.getInitialConfig<number>('flex') || 0;
                ctx = {
                    flex: flex > 0 ? true : false,
                    flexSize: flex > 0 ? flex : 0,
                    marginBefore: mrgBefore,
                    marginAfter: mrgAfter,
                    [me.boxedProperty]: (<any>viewBounds)[me.boxedProperty],
                    [me.sizeProperty]: (<any>viewBounds)[me.sizeProperty]
                };
                if (flex > 0) {
                    layoutContext.allowScroll = false
                }
                result.push(ctx);
            });
            return result;
        }

        private createLayoutContext(): BoxLayoutContextInterface {
            var me = this;
            return {
                align: me.initialConfig.align,
                pack: me.initialConfig.pack,
                margin: me.initialConfig.defaultItemMargin,
                direction: me.initialConfig.direction,
                allowScroll: me.initialConfig.allowScroll,
                bounds: Blend.Dom.getBounds(me.bodyElement)
            }
        }


        protected addChildViews(childViews: Array<Blend.ui.View>) {
            var me = this;
            if (me.implementSplitters(childViews)) {
                me.calculateMargins = false;
                me.addChildViewsWithSplitter(childViews);
            } else {
                super.addChildViews(childViews);
            }
        }

        private createSplitter() {
            var me = this
            var splitter = new Blend.ui.Splitter({
                splitType: me.layoutCssClass.indexOf('hbox') !== -1 ? 'hbox' : 'vbox'
            });
            splitter.setAttribute('parent', me.view);
            return splitter;
        }

        protected addChildViewsWithSplitter(childViews: Array<Blend.ui.View>) {
            var me = this,
                strategy: string,
                split: boolean,
                numViews = childViews.length,
                isFirst: boolean,
                isLast: boolean,
                isLastViewSplitter: boolean,
                lastView: Blend.ui.View;

            Blend.forEach(childViews, function(view: Blend.ui.View, index: number) {
                split = view.getInitialConfig('split') === true ? true : false;
                if (split && numViews > 1) {
                    isFirst = index === 0;
                    isLast = index === (numViews - 1);
                    isLastViewSplitter = Blend.isInstanceOf(lastView, Blend.ui.Splitter) === true;

                    if (isFirst) {
                        strategy = 'vs';
                    } else {
                        if (isLast) {
                            if (isLastViewSplitter) {
                                strategy = 'v';
                            } else {
                                strategy = 'sv';
                            }
                        } else { // the middle
                            if (isLastViewSplitter) {
                                strategy = 'vs';
                            } else {
                                strategy = 'sv';
                            }
                        }
                    }

                    if (strategy === 'vs') {
                        me.childViews.push(view);
                        me.childViews.push(me.createSplitter())
                    } else if (strategy == 'sv') {
                        me.childViews.push(me.createSplitter())
                        me.childViews.push(view);
                    } else {
                        me.childViews.push(view);
                    }

                } else {
                    me.childViews.push(view); // for only a single view regardless of splitting
                }
                lastView = me.childViews[me.childViews.length - 1];
            });
        }

        protected implementSplitters(childViews: Array<Blend.ui.View>): boolean {

            var me = this,
                margins: string = null,
                splitter: string = null,
                strategy: string = null;

            Blend.forEach(childViews, function(view: Blend.ui.View) {
                if (strategy === null) {
                    splitter = view.getInitialConfig<boolean>('split') === true ? 's' : null;
                    margins = Blend.isNullOrUndef(view.getInitialConfig('margins')) ? null : 'm';
                    strategy = (splitter || margins || null);
                } else {
                    return false; // stop the loop
                }
            });

            return strategy === 's' ? true : false;
        }

        protected initConfig(config?: BoxLayoutConfigInterface) {

            var defaultConfig: BoxLayoutConfigInterface = {
                defaultItemMargin: null,
                align: eBoxLayoutAlign.start,
                pack: eBoxLayoutPack.start,
                allowScroll: false
            }

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        handleLayout(itemCtxList: Array<BoxLayoutItemContextInterface>, layoutContext: BoxLayoutContextInterface) {
            var me = this;
            me.boxProcessor.calculate(itemCtxList, layoutContext);
        }

    }
}