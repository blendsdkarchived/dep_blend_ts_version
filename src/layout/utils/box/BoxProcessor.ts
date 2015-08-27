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

        protected pack_start() {
            throw new Error('Not Implemented yet!')
        }

        protected pack_center() {
            throw new Error('Not Implemented yet!')
        }

        protected pack_end() {
            throw new Error('Not Implemented yet!')
        }

        protected align_start(ilctx: BoxItemContextInterface) {
            throw new Error('Not Implemented yet!')
        }

        protected align_stretch(ilctx: BoxItemContextInterface) {
            throw new Error('Not Implemented yet!')
        }

        protected align_center(ilctx: BoxItemContextInterface) {
            throw new Error('Not Implemented yet!')
        }

        protected align_end(ilctx: BoxItemContextInterface) {
            throw new Error('Not Implemented yet!')
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
                alignFn: Function = <Function>(<any>me)[ 'align_' + Blend.getEnumValue<string>(eBoxLayoutAlign, me.layoutContext.align)],
                packFn = (<any>me)['pack_' + Blend.getEnumValue<string>(eBoxLayoutPack, me.layoutContext.pack)];
            me.resetContext();
            me.prepareContext(ilctx);
            packFn.apply(me);
            for (var i in ilctx) {
                ctx = ilctx[i];
                alignFn.apply(me, [ctx]);

            }
        }
    }
}