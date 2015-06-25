/// <reference path="BoxProcessor.ts" />
module Blend.layout.container.box {
    export class VBoxProcessor extends BoxProcessor {

        nextTop: number;

        align_start(ilctx: IBoxItemContext) {
            ilctx.left = 0;
        }

        align_stretch(ilctx: IBoxItemContext) {
            var me = this;
            ilctx.left = 0;
            ilctx.width = '100%';
        }

        align_center(ilctx: IBoxItemContext) {
            var me = this;
            ilctx.left = (me.layoutContext.bounds.width / 2) - (<number>ilctx.width / 2);
        }

        align_end(ilctx: IBoxItemContext) {
            var me = this;
            ilctx.left = me.layoutContext.bounds.width - <number>ilctx.width
        }

        pack_start(ilctx: IBoxItemContext) {
            var me = this, r;
            if (me.nextTop === -1) {
                me.nextTop = 0;
            }
            r = me.nextTop;
            me.nextTop += <number>ilctx.height;
            ilctx.top = r;
        }

        pack_center(ilctx: IBoxItemContext) {
            var me = this, r;
            if (me.nextTop === -1) {
                me.nextTop = ((me.layoutContext.bounds.height / 2) - (me.requiredSpace / 2));
            }
            r = me.nextTop;
            me.nextTop += <number>ilctx.height;
            ilctx.top = r;
        }

        pack_end(ilctx: IBoxItemContext) {
            var me = this, r;
            if (me.nextTop === -1) {
                me.nextTop = (me.layoutContext.bounds.height - me.requiredSpace);
            }
            r = me.nextTop;
            me.nextTop += <number>ilctx.height;
            ilctx.top = r;
        }

        resetContext(lctx: IBoxLayoutContext) {
            var me = this;
            super.resetContext.apply(me, arguments);
            me.nextTop = -1;
            me.flexedProperty = 'height';
        }
    }
}