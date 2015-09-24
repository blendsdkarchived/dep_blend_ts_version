/// <reference path="../Blend" />
/// <reference path="../layout/Layout" />
/// <reference path="../dom/Dom" />
/// <reference path="../mvc/View" />
/// <reference path="../interface/BoxLayoutInterface" />
/// <reference path="../interface/ViewConfigInterface" />
/// <reference path="../interface/ViewBoundsInterface" />



module Blend.ui {

    export class View extends Blend.mvc.View {

        private isViewRendered: boolean
        private eventsEnabled: boolean
        private layoutEnabled: boolean
        private sizeHash: string
        private isInALayoutContext: boolean
        private itemId: string
        //UI
        private visible: boolean
        private cssClass: DictionaryInterface

        protected borderCssClass: string
        protected layout: Blend.layout.Layout
        protected el: HTMLElement
        protected layoutTriggers: Array<string>

        /**
         * Destroys this View by setting the properties to null,
         * deleting them and removing its HTMLElement
         */
        destroy() {
            var me = this;
            if (me.parent || me.el.parentNode) {
                me.el.parentNode.removeChild(me.el);
            } else {
                me.el = null;
            }
            Blend.forEach(me, function(value: any, key: string) {
                (<any>me)[key] = null;
                delete ((<any>me)[key]);
            });
        }

        constructor(config?: ViewConfigInterface) {
            var me = this;
            super(config);
            me.isViewRendered = false;
            me.isInALayoutContext = false;
            me.eventsEnabled = true;
            me.layoutEnabled = true;
            me.layout = me.createLayout();
            me.layoutTriggers = [
                'redo-layout',
                'boundsChanged',
                'visibilityChanged'
            ];
            me.visible = me.initialConfig.visible;
            me.borderCssClass = me.initialConfig.border === true ? <string>Blend.cssPrefix('border-normal') : ''
        }

        protected initConfig(config?: ViewConfigInterface) {

            var defaultConfig: ViewConfigInterface = {
                layout: {
                    ctype: 'default'
                },
                width: null,
                height: null,
                top: null,
                left: null,
                visible: true,
                cssClass: null,
                margins: null,
                border: false
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        /**
         * Creates an instance of Blend.layout.Layout for this View
         */
        protected createLayout(): Blend.layout.Layout {
            var me = this;
            return Blend.createLayout(me.initialConfig.layout, me);
        }


        // CSS class

        /**
         * Sets the CSS class names of this View
         */
        setCssClass(value: string|Array<string>|DictionaryInterface) {
            var me = this;
            Blend.Dom.cssClass(me.el, value);
            me.cssClass = Blend.Dom.cssClass(me.el);
            me.redoLayout();
        }

        /**
         * Retrives a DictionaryInterface object containing keys of
         * css class names set to true
         */
        getCssClass() {
            return Blend.Dom.cssClass(this.el);
        }

        // Visibility

        /**
         * Sets the visibility state for this View
         */
        setVisible(visible: boolean = true) {
            var me = this
            me.visible = Blend.isNullOrUndef(visible) ? true : visible;
            me.setStyle({
                display: visible ? null : 'none'
            });
            me.notifyVisibilityChanged();
        }

        /**
         * gets the visibility state of this View
         */
        isVisible() {
            var me = this;
            return me.visible;
        }

        /**
         * Sends a visibilityChanged notification
         */
        protected notifyVisibilityChanged() {
            var me = this;
            me.fireEvent('visibilityChanged', me.visible);
        }


        // SIZE AND POSITIONING

        /**
         * Returns the bounds of this View based on the ViewBoundsInterface interface
         */
        getBounds(el?: HTMLElement): ViewBoundsInterface {
            var me = this;
            el = el || me.getElement();
            return Blend.Dom.getStyle(el, ['top', 'left', 'width', 'height']);
        }

        /**
         * Sets the bounds of this View based on the ViewBoundsInterface interface
         */
        setBounds(bounds: ViewBoundsInterface) {
            var me = this;
            me.setStyle(<StyleConfigiInterface>bounds);
            me.notifyBoundsChanged();
        }

        /**
         * Sends boundsChanged notification
         */
        notifyBoundsChanged() {
            var me = this;
            if (me.isViewRendered) {
                me.fireEvent('boundsChanged', me.getBounds());
            }
        }

        // LAYOUT

        /**
         * sets style attributes on this View
         */
        protected setStyle(styles: StyleConfigiInterface, el?: HTMLElement) {
            var me = this;
            el = el || me.el || me.getElement();
            Blend.Dom.setStyle(el, styles);
        }

        /**
         * Finalizes a layout cycle within this View
         */
        doneLayout() {
            this.sizeHash = this.getSizeHash();
            this.isInALayoutContext = false;
        }

        /**
         * Checks if this View can be placed in a layout cycle
         */
        protected canLayout() {
            return this.layoutEnabled
                && this.isViewRendered
                && this.visible;
        }

        /**
         * Temporary suspends the layout cycle
         */
        suspendLayout() {
            this.layoutEnabled = false;
        }

        /**
         * Resumes the layout cycle
         */
        resumeLayout() {
            this.layoutEnabled = true;
        }

        /**
         * Checks if the size of this View is different that sizeHash.
         * If so then this View should be placed in a layout cycle
         */
        protected shouldLayout(): boolean {
            var me = this, cur = me.getSizeHash();
            return (me.sizeHash !== cur);
        }

        /**
         * Creates and retrives the current size hash on this View
         */
        private getSizeHash(): string {
            var me = this,
                cs = <ViewBoundsInterface>me.getBounds();
            return [cs.height, cs.width].join('-');
        }

        /**
         * Performs the actual layout peration on thie View
         */
        protected layoutView() {
            this.layout.performLayout.apply(this.layout, arguments);
        }

        /**
         * Put this View in a parent layout context by passing true
         * or false otherwise
         */
        placeInALayoutContext(state: boolean) {
            this.isInALayoutContext = state;
        }

        /**
         * Initiates a layout cycle on this View
         */
        performLayout() {
            var me = this;
            if (me.canLayout()) {
                me.suspendLayout();
                if (me.shouldLayout()) {
                    me.layoutView.apply(me, arguments);
                }
                me.resumeLayout();
            }
        }

        /**
         * Initiates a layout cycle based on an event. This function also checks
         * whether the view is currently part of an existing layout cycle.
         * If the component is part on a layout cycle then its native performLayout is
         * called, otherwise if it has a parent then the layout cycle will be deligated
         * from there.
         */
        private handleLayoutTriggers(eventName: string) {
            var me = this;
            // only fire and event when the component is rendered and ready
            if (me.layoutTriggers.indexOf(eventName) !== -1 && me.canLayout()) {
                if (!me.isInALayoutContext && me.parent) {
                    (<View>me.parent).invalidateLayout();
                    (<View>me.parent).performLayout();
                } else {
                    me.performLayout();
                }
            }
        }

        /**
         * Makes sure the layout state is invalid so it can be placed in
         * the next layout cycle
         */
        invalidateLayout(performLayout?: boolean) {
            var me = this;
            me.sizeHash = null;
            if (performLayout === true) {
                me.performLayout();
            }
        }

        // INTERNAL EVENTS

        /**
         * Internal notification to initiate a layout cycle. This method
         * is used when the View has to replayout but no external event
         * should be fired
         */
        protected redoLayout() {
            this.fireEvent('redo-layoyt');
        }

        protected fireEvent(eventName: string, ...args: any[]) {
            /**
             * Override of the fireEvent function to trigger
             * performLayout on registered events.
             */
            var me = this;
            if (me.isViewRendered === true && me.canFireEvents()) {
                me.handleLayoutTriggers(eventName);
                if (eventName !== 'redo-layout') {
                    super.fireEvent.apply(me, arguments);
                }
            }
        }

        /**
         * Disables the event and notification on this View
         */
        protected dispableEvents() {
            this.eventsEnabled = false;
        }

        /**
         * Enables the event and notification on this view
         */
        protected enableEvents() {
            this.eventsEnabled = true;
        }

        /**
         * Checks if the events are enabled
         */
        protected canFireEvents() {
            return this.eventsEnabled;
        }

        // RENDER
        render(layoutConfig: CreateElementInterface = {}): HTMLElement {
            throw new Error('Not Implemented Yet!');
        }

        /**
         *Helps configuring the thsi View before the rendering cycle is complete
         */
        protected finalizeRender() {
            var me = this;
            me.setVisible(me.initialConfig.visible);
            me.setCssClass(<Array<string>>[me.initialConfig.cssClass, me.borderCssClass]);
            me.setBounds({
                width: me.initialConfig.width,
                height: me.initialConfig.height,
                top: me.initialConfig.top,
                left: me.initialConfig.left,
            });
        }

        /**
        * Retrives the HTMLElement for this View
        */
        getElement(): HTMLElement {
            var me = this;
            if (!me.isViewRendered) {
                me.el = me.layout.render();
                me.dispableEvents();
                me.finalizeRender();
                me.enableEvents();
                me.isViewRendered = true;
            }
            return me.el;
        }

        /**
        * Prepares the element spec before passing it the createElement
        */
        private prepareElement(elConfig: CreateElementInterface) {
            var me = this,
                data = {
                    // @TODO
                    // style: me.style || {},
                    // cls: me.cls || []
                };
            Blend.apply(elConfig, data, false, true);
            return elConfig;
        }

        /**
        * Wrapper function for Blend.dom.CreateElement. It additionally will
        * call the prepareElement in case we need to configure the element
        * spec before creating it
        */
        protected createElement(config: CreateElementInterface, elCallback?: Function, elCallbackScope?: any): HTMLElement {
            var me = this;
            return Blend.Dom.createElement(me.prepareElement(config), elCallback, me);
        }
    }
}