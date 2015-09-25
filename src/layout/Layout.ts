/// <reference path="../Blend" />
/// <reference path="../Component" />
/// <reference path="../ui/View" />

module Blend.layout {

    /**
     * Base class for all layout providers.
     */
    export class Layout extends Component {

        private viewRendered: boolean
        protected view: Blend.ui.View
        protected initialConfig: LayoutConfigInterface

        constructor(config: LayoutConfigInterface) {
            var me = this;
            super(config);
            me.view = me.initialConfig.view;
            me.viewRendered = false;
        }

        performLayout() {
            var me = this;
            this.view.doneLayout();
        }

        protected assignElements(el: HTMLElement, id: string): void {

        }

        render(spec?: CreateElementInterface): HTMLElement {
            var me = this;
            me.viewRendered = true;
            return Blend.Dom.createElement(spec || {}, me.assignElements, me);
        }

        isViewRendered(view?: Blend.ui.View): boolean {
            return this.viewRendered;
        }

    }
}