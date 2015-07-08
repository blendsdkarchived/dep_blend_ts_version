///<reference path="View.ts"/>
///<reference path="../dom/Dom.ts"/>

module Blend.ui {

    export interface IRectangleConfig extends IViewConfig {
        color?: string;
        text?: string;
    }

    export var nextID = 0;

    export class Rectangle extends Blend.ui.View {

        protected initialConfig: IRectangleConfig
        protected color: string;
        private rectId: string;

        constructor(config?: IRectangleConfig) {
            var me = this;
            me.rectId = 'rect' + (Blend.ui.nextID++).toString();
            super(config);

        }

        setText(value: string) {
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

        protected initConfig(config?: IViewConfig) {

            var defaultConfig: IViewConfig = {
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                width: 100,
                height: 100
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        render(layoutConfig: ICreateElement = {}): HTMLElement {
            var me = this,
                spec = {
                    id: me.rectId,
                    style: {
                        border: '1px dashed black'
                    }
                }
            return me.createElement(Blend.apply(spec, layoutConfig));
        }

        finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.setColor(me.initialConfig.color);
            me.setText(me.initialConfig.text || Blend.ucFirst(me.rectId));
        }

    }
}
Blend.registerClassWithAlias('ui.rect', Blend.ui.Rectangle);