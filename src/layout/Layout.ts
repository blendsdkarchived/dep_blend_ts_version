/// <reference path="../Blend.ts" />
/// <reference path="../Component" />
/// <reference path="../ComponentInterfaces.ts" />
/// <reference path="../ui/View.ts" />


module Blend.layout {

    /**
     * Base class for all layout providers.
     */
    export class Layout extends Component {

        protected view: Blend.ui.View;
        protected cssClassName: string;
        protected initialConfig:ILayoutConfig;

        constructor(config: ILayoutConfig) {
            var me = this;
            super(config);
            me.cssClassName = 'default';
            me.view = me.initialConfig.view;
        }

        performLayout() {
            var me = this;
            this.view.doneLayout();
        }

        render(): HTMLElement {
            var me = this,
                spec:IDictionary = {};
            if (me.cssClassName) {
                spec['cls'] = <string[]>Blend.cssPrefix(me.cssClassName+'-layout', true);
            }
            return this.view.render.apply(this.view, [spec]);
        }

    }

    Blend.registerClassWithAlias('layout.default', Blend.layout.Layout);
}

module Blend {
    /**
         * Creates a Layout component for a View component
         * @internal
         */
    export function createLayout(config: ILayoutConfig, view: Blend.ui.View): Blend.layout.Layout {
        if (config && config.ctype) {
            config.ctype = "layout." + config.ctype;
            config.view = view;
            return <Blend.layout.Layout>Blend.createObjectWithAlias(config);
        } else {
            throw new Error('Invalid ILayoutConfig object.')
        }
    }
}