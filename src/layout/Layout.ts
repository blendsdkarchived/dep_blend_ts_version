///<reference path="../Blend.ts"/>
///<reference path="../ui/View.ts"/>
module Blend.layout {
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
        cssKeyName: string;

        constructor(config: ILayoutConfig, view: Blend.ui.View) {
            var me = this;
            super(config);
            me.view = view;
        }

        performLayout() {
            var me = this;
            this.view.doneLayout();
        }

        render(): HTMLElement {
            var me = this,
                spec = {};
            if (me.cssKeyName) {
                spec['cls'] = Blend.cssPrefix(me.cssKeyName, true);
            }
            return this.view.render.apply(this.view, [spec]);
        }

    }

    Blend.registerClassWithAlias('layout.default', Blend.layout.Layout);

    export function createLayout(config: ILayoutConfig, view: Blend.ui.View): Layout {
        if (config && config.alias) {
            return <Layout>Blend.createObjectWithAlias('layout.' + config.alias, config, view);
        } else {
            return null;
        }
    }
}
