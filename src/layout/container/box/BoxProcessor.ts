/// <reference path="../../../Blend.ts" />
/// <reference path="../../BoxUtil.ts" />

module Blend.layout.container.box {

    export class BoxProcessor {

        layoutContext: IBoxLayoutContext;
        needTotals: boolean;
        requiredSpace: number;
        flexedProperty: string;

        pack_start(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        pack_center(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        pack_end(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        align_start(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        align_stretch(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        align_center(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        align_end(ilctx: IBoxItemContext) {
            throw new Error('Not Implemented yet!')
        }

        resetContext(lctx: IBoxLayoutContext) {
            var me = this;
            me.layoutContext = lctx;
            me.needTotals = (lctx.pack === IBoxLayoutPack.center || lctx.pack === IBoxLayoutPack.end);
            me.requiredSpace = 0;
        }

        prepareContext(ilctx: Array<IBoxItemContext>) {
            var me = this, maxFlex = 0, pixelsPerFlex, flexedItems = [], size;
            Blend.forEach(ilctx, function(ctx, idx) {
                if (ctx.flex === true) {
                    maxFlex += ctx.flexSize;
                    flexedItems.push(idx);
                } else {
                    me.requiredSpace += ctx[me.flexedProperty];
                }
            });

            if (maxFlex !== 0) {
                pixelsPerFlex = (me.layoutContext.bounds[me.flexedProperty] - me.requiredSpace) / maxFlex;
                Blend.forEach(flexedItems, function(idx) {
                    size = pixelsPerFlex * ilctx[idx].flexSize;
                    ilctx[idx][me.flexedProperty] = size;
                    me.requiredSpace += size
                });
            }
        }

        proccess(ilctx: Array<IBoxItemContext>, lctx: IBoxLayoutContext) {
            var me = this, ctx: IBoxItemContext,
                alignFn = me['align_' + Blend.getEnumValue(IBoxLayoutAlign, lctx.align)],
                packFn = me['pack_' + Blend.getEnumValue(IBoxLayoutPack, lctx.pack)]
            me.resetContext(lctx);
            me.prepareContext(ilctx)
            for (var i in ilctx) {
                ctx = ilctx[i];
                alignFn.apply(me, [ctx]);
                packFn.apply(me, [ctx])
                lctx.handler(ctx, i);
            }
        }
    }
}