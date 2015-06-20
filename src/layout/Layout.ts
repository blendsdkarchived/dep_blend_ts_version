///<reference path="../Blend.ts"/>
///<reference path="../ui/View.ts"/>
module Blend {
    export module layout {

        /**
         * Layout registry interface
         */
        interface ILayoutRegistry {
            [alias: string]: (config: ILayoutConfig, view: Blend.ui.View) => Layout;
        }

        export interface ILayoutConfig {
            alias: string;
        }

        export class Layout extends Blend.BaseClass {

            view: Blend.ui.View;

            constructor(config: ILayoutConfig, view: Blend.ui.View) {
                super(config);
                this.view = view;
            }

            performLayout() {
                this.view.doneLayout();
            }

            render(): HTMLElement {
                return this.view.render.apply(this.view, arguments);
            }
        }

        Blend.registerClassWithAlias('layout.default',Blend.layout.Layout);

        export function createLayout(config: ILayoutConfig, view: Blend.ui.View): Layout {
            if(config && config.alias) {
                return <Layout>Blend.createObjectWithAlias('layout.'+ config.alias,config,view);
            } else {
                return null;
            }
        }

    }
}