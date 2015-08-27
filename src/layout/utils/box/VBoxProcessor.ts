/// <reference path="../../../Blend" />
/// <reference path="BoxProcessor" />
/// <reference path="../../../interface/BoxLayoutInterface" />

module Blend.layout.container.box {

    export class VBoxProcessor extends BoxProcessor {

        private rtl:string;

        protected align_start(ilctx: BoxItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.rtl] = 0;
        }

        protected align_stretch(ilctx: BoxItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.rtl] = 0;
            ilctx.width = '100%';
        }

        protected align_center(ilctx: BoxItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.rtl] = (me.layoutContext.bounds.width / 2) - (<number>ilctx.width / 2);
        }

        protected align_end(ilctx: BoxItemContextInterface) {
            var me = this;
            (<any>ilctx)[me.rtl] = me.layoutContext.bounds.width - <number>ilctx.width;
        }

        protected pack_start() {
            var me = this;
            me.layoutContext.packUnits = 0;
        }

        protected  pack_center() {
            var me = this;
            me.layoutContext.packUnits = ((me.layoutContext.bounds.height / 2) - (me.requiredSpace / 2))
        }

        protected pack_end() {
            var me = this;
            me.layoutContext.packUnits = (me.layoutContext.bounds.height - (me.requiredSpace));
        }

        protected resetContext() {
            var me = this;
            super.resetContext.apply(me, arguments);
            me.boxedProperty = 'height';
            me.rtl = me.layoutContext.direction === eBoxLayoutDirection.RightToLeft ? 'right' :'left'
        }

    }
}