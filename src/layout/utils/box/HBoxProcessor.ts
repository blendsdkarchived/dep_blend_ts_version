/// <reference path="../../../Blend" />
/// <reference path="BoxProcessor" />

/// <reference path="../../../interface/BoxLayoutInterface" />

module Blend.layout.container.box {

    export class HBoxProcessor extends BoxProcessor {

        protected align_start(ilctx: BoxItemContextInterface) {
            ilctx.top = 0;
        }

        protected align_stretch(ilctx: BoxItemContextInterface) {
            ilctx.top = 0;
            ilctx.height = '100%';
        }

        protected align_center(ilctx: BoxItemContextInterface) {
            var me = this;
            ilctx.top = (me.layoutContext.bounds.height / 2) - (<number>ilctx.height / 2);
        }

        protected align_end(ilctx: BoxItemContextInterface) {
            var me = this;
            ilctx.top = me.layoutContext.bounds.height - <number>ilctx.height;
        }

        protected pack_start() {
            var me = this;
            me.layoutContext.packUnits = 0;
        }

        protected  pack_center() {
            var me = this;
            me.layoutContext.packUnits = ((me.layoutContext.bounds.width / 2) - (me.requiredSpace / 2))
        }

        protected pack_end() {
            var me = this;
            me.layoutContext.packUnits = (me.layoutContext.bounds.width - (me.requiredSpace));
        }

        protected resetContext() {
            var me = this;
            super.resetContext.apply(me, arguments);
            me.boxedProperty = 'width';
        }
    }
}