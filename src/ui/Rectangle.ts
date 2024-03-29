///<reference path="View.ts"/>
/// <reference path="../interface/ViewConfigInterface" />
///<reference path="../dom/Dom.ts"/>

module Blend.ui {

    export interface IRectangleConfig extends ViewConfigInterface {
        color?: string
        text?: string,
        border?: boolean
    }

    export var nextID = 0;

    export class Rectangle extends Blend.ui.View {

        protected initialConfig: IRectangleConfig
        protected color: string
        private rectId: string
        layoutCount: number;

        constructor(config?: IRectangleConfig) {
            var me = this;
            me.rectId = 'rect' + (Blend.ui.nextID++).toString();
            me.layoutCount = 0;
            me.cssClass = Blend.cssPrefix('rectangle');
            super(config);
        }

        setText(value: any) {
            var me = this;
            me.el.innerHTML = value;
        }

        getText(): string {
            var me = this;
            return me.el.innerHTML;
        }

        setColor(hexcode: string) {
            var me = this;
            me.color = hexcode;
            me.setStyle({
                'background-color': hexcode
            });
        }

        getColor(): string {
            return this.color;
        }

        protected layoutView() {
            var me = this;
            super.layoutView();
            me.setText(++me.layoutCount);
        }

        protected initConfig(config?: ViewConfigInterface) {

            var defaultConfig: ViewConfigInterface = {
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                width: 100,
                height: 100
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.setColor(me.initialConfig.color);
            me.setText(me.initialConfig.text || Blend.ucFirst(me.rectId));
        }

    }
}