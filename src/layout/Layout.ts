/// <reference path="../Blend" />
/// <reference path="../Component" />
/// <reference path="../ui/View" />

module Blend.layout {

    /**
     * Base class for all layout providers.
     */
    export class Layout extends Component {

        protected view: Blend.ui.View
        protected cssClassName: string
        protected initialConfig: LayoutConfigInterface

        constructor(config: LayoutConfigInterface) {
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
            /**
             * We don't need to re-render the container if it has already been rendered
             */
            var me = this,
                spec: DictionaryInterface = {};
            if (me.isViewRendered()) {
                return me.view.getElement();
            } else {
                if (me.cssClassName) {
                    spec['cls'] = <string[]>Blend.cssPrefix(me.cssClassName + '-layout', true);
                }
                return me.view.render.apply(me.view, [spec]);
            }
        }

        protected isViewRendered(view?: Blend.ui.View): boolean {
            var me = this;
            view = view || me.view;
            return view.getAttribute<boolean>('isViewRendered');
        }

    }
}