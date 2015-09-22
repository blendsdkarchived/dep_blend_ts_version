/// <reference path="../../../Blend" />
/// <reference path="BoxProcessor" />
/// <reference path="../../../interface/BoxLayoutInterface" />

module Blend.layout.container.box {

    export class HBoxProcessor extends BoxProcessor {

        constructor() {
            var me = this;
            super();
            me.alignProperty = 'top';
            me.packProperty = 'left';
            me.stretchProperty = 'height';
            me.boxedProperty = 'width';
        }
    }
}