/// <reference path="../../../Blend" />
/// <reference path="BoxProcessor" />
/// <reference path="../../../interface/BoxLayoutInterface" />

module Blend.layout.container.box {

    export class VBoxProcessor extends BoxProcessor {

        constructor() {
            var me = this;
            super();
            me.alignProperty = 'left';
            me.packProperty = 'top';
            me.stretchProperty = 'width';
            me.boxedProperty = 'height';
        }

    }
}