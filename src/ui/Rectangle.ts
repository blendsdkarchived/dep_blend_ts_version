///<reference path="View.ts"/>
///<reference path="../dom/Dom.ts"/>

module Blend.ui {

    export interface IRectangleConfig extends IViewConfig {
        color?: string;
    }

    export class Rectangle extends Blend.ui.View {

        protected initialConfig: IRectangleConfig
        protected color: string;

        constructor(config?: IRectangleConfig) {
            super(config);
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

        initConfig(config: IViewConfig) {
            var me = this,
                defaultConfig = {
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
                }
            return Blend.apply(defaultConfig, super.initConfig(config), true, false);
        }

        render(layoutConfig: ICreateElement = {}): HTMLElement {
            var me = this,
                spec = {

                }
            return me.createElement(Blend.apply(spec,layoutConfig));
        }


        finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.setColor(me.initialConfig.color);
        }

    }
}
Blend.registerClassWithAlias('ui.rect', Blend.ui.Rectangle);