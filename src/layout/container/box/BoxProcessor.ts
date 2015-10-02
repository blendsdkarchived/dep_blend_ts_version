/// <reference path="../../../Blend" />
/// <reference path="../../../interface/BoxLayoutInterface" />

module Blend.layout.container.box {

    /**
     * Base class for Horizontal and Vertical BoxLayoutItemContextInterface processors.
     *
     * @internal
     */
    export class BoxProcessor {

        protected layoutContext: BoxLayoutContextInterface;
        protected needTotals: boolean;
        protected requiredSpace: number;
        protected boxedProperty: string;
        protected nextUnit: number;
        protected alignProperty: string;
        protected packProperty: string;
        protected stretchProperty: string;

        protected  pack_start(ilctx: BoxLayoutItemContextInterface) {
            var me = this, r: number;
            if (me.nextUnit === -1) {
                me.nextUnit = ilctx.marginBefore;
            } else {
                me.nextUnit += ilctx.marginBefore;
            }
            r = me.nextUnit;
            me.nextUnit += <number>(<any>ilctx)[me.boxedProperty] + ilctx.marginAfter;
            (<any>ilctx)[me.packProperty] = r;
        }

        protected  pack_center(ilctx: BoxLayoutItemContextInterface) {
            var me = this, r: number;
            if (me.nextUnit === -1) {
                me.nextUnit = ilctx.marginBefore;
                me.nextUnit += (((<any>me.layoutContext.bounds)[me.boxedProperty] / 2) - (me.requiredSpace / 2));
            } else {
                me.nextUnit += ilctx.marginBefore;
            }
            r = me.nextUnit;
            me.nextUnit += <number>(<any>ilctx)[me.boxedProperty] +  ilctx.marginAfter;
            (<any>ilctx)[me.packProperty] = r;
        }

        protected  pack_end(ilctx: BoxLayoutItemContextInterface) {
            var me = this, r: number;
            if (me.nextUnit === -1) {
                me.nextUnit = ilctx.marginBefore;
                me.nextUnit += ((<any>me.layoutContext.bounds)[me.boxedProperty] - (me.requiredSpace));
            } else {
                me.nextUnit += ilctx.marginBefore;
            }
            r = me.nextUnit;
            me.nextUnit += <number>(<any>ilctx)[me.boxedProperty] + ilctx.marginAfter;
            (<any>ilctx)[me.packProperty] = r;
        }

        protected  align_start(ilctx: BoxLayoutItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.alignProperty] = 0;
        }

        protected  align_stretch(ilctx: BoxLayoutItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.alignProperty] = 0;
            (<any>ilctx)[me.stretchProperty] = '100%';
        }

        protected  align_center(ilctx: BoxLayoutItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.alignProperty] = ((<any>me.layoutContext.bounds)[me.stretchProperty] / 2) - (<number>(<any>ilctx)[me.stretchProperty] / 2);
        }

        protected  align_end(ilctx: BoxLayoutItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.alignProperty] = (<any>me.layoutContext.bounds)[me.stretchProperty] - <number>(<any>ilctx)[me.stretchProperty];
        }

        /**
         * Reset the current layout context in this processor.
         * This function is part of the initialization process
         * @internal
         */
        protected resetContext() {
            var me = this;
            me.needTotals = (me.layoutContext.pack === eBoxLayoutPack.center || me.layoutContext.pack === eBoxLayoutPack.end);
            me.requiredSpace = 0;
            me.nextUnit = -1;
        }

        /**
         * Prepares the list of BoxLayoutItemContextInterfaces by calculating the total required space
         * used by the items
         */
        protected prepareContext(ilctx: Array<BoxLayoutItemContextInterface>) {
            var me = this,
                maxFlex: number = 0,
                pixelsPerFlex: number,
                size: number,
                availSpace: number,
                flexedItems: Array<number> = [];
            Blend.forEach(ilctx, function(ctx: BoxLayoutItemContextInterface, idx: number) {
                if (ctx.flex === true) {
                    maxFlex += ctx.flexSize;
                    flexedItems.push(idx);
                } else { // fixed
                    me.requiredSpace += ((<number>(<any>ctx)[me.boxedProperty]) + ctx.marginBefore + ctx.marginAfter);
                }
            });

            if (maxFlex !== 0) {
                availSpace = (<number>(<any>me.layoutContext.bounds)[me.boxedProperty] - me.requiredSpace)
                pixelsPerFlex = availSpace / maxFlex;
                me.layoutContext.flexPerPixel = maxFlex / availSpace;
                Blend.forEach(flexedItems, function(idx: number) {
                    size = (pixelsPerFlex * ilctx[idx].flexSize) - (ilctx[idx].marginBefore + ilctx[idx].marginAfter);
                    size = size > 0 ? size : 0;
                    (<any>ilctx)[idx][me.boxedProperty] = size;
                    me.requiredSpace += size
                });
            }
        }

        /**
         * Processor entry point
         */
        calculate(ilctx: Array<BoxLayoutItemContextInterface>, lctx: BoxLayoutContextInterface) {
            var me = this;
            me.layoutContext = lctx;
            var ctx: BoxLayoutItemContextInterface,
                alignFn: Function = <Function>(<any>me)['align_' + Blend.getEnumValue<string>(eBoxLayoutAlign, me.layoutContext.align)],
                packFn = (<any>me)['pack_' + Blend.getEnumValue<string>(eBoxLayoutPack, me.layoutContext.pack)];
            me.resetContext();
            me.prepareContext(ilctx);
            for (var i in ilctx) {
                ctx = ilctx[i];
                alignFn.apply(me, [ctx]);
                packFn.apply(me, [ctx]);
            }
        }

    }
}