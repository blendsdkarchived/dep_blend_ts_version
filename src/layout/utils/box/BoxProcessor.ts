/// <reference path="../../../Blend" />
/// <reference path="../../../interface/BoxLayoutInterface" />

module Blend.layout.container.box {

    /**
     * Base class for Horizontal and Vertical BoxItemContextInterface processors.
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

        protected  pack_start(ilctx: any) {
            var me = this, r: number;
            if (me.nextUnit === -1) {
                me.nextUnit = 0;
            }
            r = me.nextUnit;
            me.nextUnit += <number>ilctx[me.boxedProperty];
            ilctx[me.packProperty] = r;
        }

        protected  pack_center(ilctx: any) {
            var me = this, r: number;
            if (me.nextUnit === -1) {
                me.nextUnit = (((<any>me.layoutContext.bounds)[me.boxedProperty] / 2) - (me.requiredSpace / 2));
            }
            r = me.nextUnit;
            me.nextUnit += <number>ilctx[me.boxedProperty];
            ilctx[me.packProperty] = r;
        }

        protected  pack_end(ilctx: any) {
            var me = this, r: number;
            if (me.nextUnit === -1) {
                me.nextUnit = ((<any>me.layoutContext.bounds)[me.boxedProperty] - (me.requiredSpace));
            }
            r = me.nextUnit;
            me.nextUnit += <number>ilctx[me.boxedProperty];
            ilctx[me.packProperty] = r;
        }

        protected  align_start(ilctx: any) {
            var me = this;
            ilctx[me.alignProperty] = 0;
        }

        protected  align_stretch(ilctx: any) {
            var me = this;
            ilctx[me.alignProperty] = 0;
            ilctx[me.stretchProperty] = '100%';
        }

        protected  align_center(ilctx: any) {
            var me = this;
            ilctx[me.alignProperty] = ((<any>me.layoutContext.bounds)[me.stretchProperty] / 2) - (<number>ilctx[me.stretchProperty] / 2);
        }
        protected  align_end(ilctx: any) {
            var me = this;
            ilctx[me.alignProperty] = (<any>me.layoutContext.bounds)[me.stretchProperty] - <number>ilctx[me.stretchProperty];
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
         * Prepares the list of BoxItemContextInterfaces by calculating the total required space
         * used by the items
         */
        protected prepareContext(ilctx: Array<BoxItemContextInterface>) {
            var me = this,
                maxFlex: number = 0,
                pixelsPerFlex: number,
                size: number,
                flexedItems: Array<number> = [];
            Blend.forEach(ilctx, function(ctx: BoxItemContextInterface, idx: number) {
                if (ctx.flex === true) {
                    maxFlex += ctx.flexSize;
                    flexedItems.push(idx);
                } else {
                    me.requiredSpace += (<number>(<any>ctx)[me.boxedProperty]);
                }
            });

            if (maxFlex !== 0) {
                pixelsPerFlex = (<number>(<any>me.layoutContext.bounds)[me.boxedProperty] - me.requiredSpace) / maxFlex;
                Blend.forEach(flexedItems, function(idx: number) {
                    size = pixelsPerFlex * ilctx[idx].flexSize;
                    (<any>ilctx)[idx][me.boxedProperty] = size;
                    me.requiredSpace += size
                });
            }
        }

        /**
         * Processor entry point
         */
        calculate(ilctx: Array<BoxItemContextInterface>, lctx: BoxLayoutContextInterface) {
            var me = this;
            me.layoutContext = lctx;
            var ctx: BoxItemContextInterface,
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