/// <reference path="BoxProcessor.ts" />
module Blend.layout.container.box {
    export class HBoxProcessor extends BoxProcessor {

        nextLeft: number;

        align_start(ilctx: IBoxItemContext) {
            ilctx.top = 0;
        }

        align_stretch(ilctx: IBoxItemContext) {
            ilctx.top = 0;
            ilctx.height = '100%';
        }

        align_center(ilctx: IBoxItemContext) {
            var me = this;
            ilctx.top = (me.layoutContext.bounds.height / 2) - (<number>ilctx.height / 2);
        }

        align_end(ilctx: IBoxItemContext) {
            var me = this;
            ilctx.top = me.layoutContext.bounds.height - <number>ilctx.height;
        }

        pack_start(ilctx: IBoxItemContext) {
            var me = this, r;
            if (me.nextLeft === -1) {
                me.nextLeft = 0;
            }
            r = me.nextLeft;
            me.nextLeft += <number>ilctx.width;
            ilctx.left = r;
        }

        pack_center(ilctx: IBoxItemContext) {
            var me = this, r;
            if (me.nextLeft === -1) {
                me.nextLeft = ((me.layoutContext.bounds.width / 2) - (me.requiredSpace / 2));
            }
            r = me.nextLeft;
            me.nextLeft += <number>ilctx.width;
            ilctx.left = r;
        }

        pack_end(ilctx: IBoxItemContext) {
            var me = this, r;
            if (me.nextLeft === -1) {
                me.nextLeft = (me.layoutContext.bounds.width - (me.requiredSpace));
            }
            r = me.nextLeft;
            me.nextLeft += <number>ilctx.width;
            ilctx.left = r;
        }

        resetContext(lctx: IBoxLayoutContext) {
            var me = this;
            super.resetContext.apply(me, arguments);
            me.nextLeft = -1;
            me.flexedProperty = 'width';
        }
    }
}