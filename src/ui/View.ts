///<reference path="../mvc/View.ts"/>
///<reference path="../utils/Dom.ts"/>
///<reference path="../layout/Layout.ts"/>

/**
 * Layout process
 * Caller:
 *      [1] Call View => performLayout
 *      [2] performLayout => View:layoutView
 *      [3] View:Layout => performLayout
 *      [4] View:Layout:performLayout => View:doneLayout
 *
 *      Use View:layoutView to layout View's inner elements if needed.
 *          ideally this should be done by the "component" layout
 *
 *      Incase of a container use the layoutInnerElements
 */

module Blend.ui {

    export interface IViewConfig extends Blend.mvc.IViewConfig {
        layoutConfig?: Blend.layout.ILayoutConfig;
        style?: Blend.dom.IStyleConfig;
    }

    export interface IViewBounds {
        top?: number;
        left?: number;
        width?: number|string;
        height?: number|string;
    }

    export class View extends Blend.mvc.View implements IViewConfig {

        parent: Blend.ui.View;
        style: Blend.dom.IStyleConfig;
        cls: string|Array<string>;

        protected el: HTMLElement;
        protected _rendered: boolean = false;
        protected defaultLayout: string;
        layout: Blend.layout.Layout;
        private _canLayout: boolean = true;
        private _canFireEvent: boolean = true;
        private _sizeSig: string;
        private _inALayoutContext: boolean = false;
        protected layoutTriggers: Array<string>;
        isVisible: boolean;


        constructor(config?: IViewConfig) {
            super(config);
            var me = this,
                lc = (config && config.layoutConfig) ? config.layoutConfig : <Blend.layout.ILayoutConfig>{ ctype: me.defaultLayout || 'default' };
            me.layout = Blend.layout.createLayout(lc, me);
            me.layoutTriggers = me.layoutTriggers || [
                'boundsChanged'
            ];
        }

        fireEvent(eventName: string, ...args: any[]) {
            /**
             * Override of the fireEvent function to trigger
             * performLayout on registered events.
             */
            var me = this;
            if (me._rendered === true && me.canFireEvents()) {
                // only fire and event when the component is rendered and ready
                if (me.layoutTriggers.indexOf(eventName) !== -1 && me.canLayout()) {
                    if (!me._inALayoutContext && me.parent) {
                        me.parent.invalidateLayout();
                        me.parent.performLayout();
                    } else {
                        me.performLayout();
                    }
                }
                super.fireEvent.apply(me, arguments);
            }
        }

        placeInALayoutContext(state:boolean) {
            this._inALayoutContext = state;
        }

        dispableEvents() {
            this._canFireEvent = false;
        }

        enableEvents() {
            this._canFireEvent = true;
        }

        canFireEvents() {
            return this._canFireEvent;
        }

        setStyle(styles: Blend.dom.IStyleConfig, el?: HTMLElement) {
            var me = this;
            el = el || me.getElement();
            Blend.Dom.setStyle(el, styles);
        }

        /* SIZE AND POSITION */

        getBounds(el?: HTMLElement): IViewBounds {
            var me = this;
            el = el || me.getElement();
            return Blend.Dom.getStyle(el, ['top', 'left', 'width', 'height']);
        }

        setBounds(bounds: IViewBounds) {
            var me = this;
            me.setStyle(<Blend.dom.IStyleConfig>bounds);
            me.notifyBoundsChanged();
        }

        notifyBoundsChanged() {
            var me = this;
            me.fireEvent('boundsChanged', me.getBounds());
        }

        /* LAYOUT */

        canLayout() {
            return this._canLayout && this._rendered;
        }

        suspendLayout() {
            this._canLayout = false;
        }

        resumeLayout() {
            this._canLayout = true;
        }

        doneLayout() {
            this._sizeSig = this.getSizeSig();
            this._inALayoutContext = false;
        }

        layoutView() {
            this.layout.performLayout.apply(this.layout, arguments);
        }

        performLayout() {
            var me = this;
            if (me.canLayout()) {
                me._canLayout = false;
                if (me.shouldLayout()) {
                    me.layoutView.apply(me, arguments);
                }
                me._canLayout = true;
            }
        }

        shouldLayout(): boolean {
            var me = this, cur = me.getSizeSig();
            return (me._sizeSig !== cur);
        }

        invalidateLayout() {
            var me = this;
            me._sizeSig = null;
        }

        private getSizeSig(): string {
            var me = this,
                cs = <IViewBounds>me.getBounds();
            return [cs.top, cs.left, cs.height, cs.width, cs.height].join('-');
        }

        /* RENDER */

        getElement(): HTMLElement {
            var me = this;
            if (!me._rendered) {
                me.el = me.layout.render();
                me._rendered = true;
            }
            return me.el;
        }

        prepareElement(elConfig: Blend.dom.ICreateElement) {
            var me = this,
                data = {
                    style: me.style || {},
                    cls: me.cls || []
                };
            Blend.apply(elConfig, data, false, true);
            return elConfig;
        }

        createElement(config: Blend.dom.ICreateElement, elCallback?: Function, elCallbackScope?: any): HTMLElement {
            var me = this;
            return Blend.Dom.createElement(me.prepareElement(config), elCallback, me);
        }

        render(extraConfig?: Blend.dom.ICreateElement): HTMLElement {
            throw new Error('Not Implemented Yet!');
        }
    }
}