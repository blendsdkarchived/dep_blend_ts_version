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

        // internal database of registered layouts
        var layoutRegistry = {};

        export function registerLayout(alias: string, createInstanceCallback: (config: ILayoutConfig, view: Blend.ui.View) => Layout) {
            layoutRegistry[alias] = createInstanceCallback;
        }

        export function createLayout(config: ILayoutConfig, view: Blend.ui.View): Layout {
            if (layoutRegistry[config.alias]) {
                return layoutRegistry[config.alias].apply(window, [config, view]);
            } else {
                throw new Error(`Layout with alias ${config.alias} does not exist or is not registered!!`);
            }
        }

        registerLayout('default', function(config: ILayoutConfig, view: Blend.ui.View) {
            return new Blend.layout.Layout(config, view);
        });
    }
}