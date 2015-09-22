/// <reference path="../../Blend" />
/// <reference path="../../dom/Dom" />
/// <reference path="../View" />
/// <reference path="../../interface/SplitterConfigInterface" />
/// <reference path="../../interface/ViewBoundsInterface" />


module Blend.ui.splitter {

    export class Splitter extends Blend.ui.View {

        protected initialConfig: SplitterConfigInterface;
        protected splitType: string;
        protected activeCssClass: string;
        protected hoverCssClass: string;
        protected isActive: boolean;
        protected ghostEl: HTMLElement;
        protected origin: ViewBoundsInterface;
        protected moveHandlerFn: EventListener;

        constructor(config?: SplitterConfigInterface) {
            var me = this;
            super(config);
            me.splitType = me.initialConfig.splitType;
            me.activeCssClass = <string>Blend.cssPrefix('splitter-active');
            me.hoverCssClass = <string>Blend.cssPrefix('splitter-hover');
            me.isActive = false;
            me.ghostEl = null;
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.initHoverEffect();

            Blend.Dom.addEventListener(me.el, 'mousedown', function(ev: MouseEvent) {
                me.activate.apply(me, arguments);
            });
            Blend.Dom.addEventListener(document, 'mouseup', function(ev: MouseEvent) {
                me.deActivate.apply(me, arguments);
            });
        }



        private handleMovement(ev: MouseEvent) {
            var me = this,
                hMovement = ev.screenX - me.origin.left,
                vMovement = ev.screenY - me.origin.top;

            if (me.splitType === 'hbox') {
                Blend.Dom.setStyle(me.ghostEl, {
                    left: me.ghostEl.clientLeft + hMovement
                });
            }
        }

        private positionGhost() {
            var me = this;
            if (!me.ghostEl) {
                me.createGhost();
            }
            Blend.Dom.setStyle(me.ghostEl, { display: 'block' }); // show
            var bounds = <any>me.el.getBoundingClientRect()
            // if (me.splitType === 'hbox') {
            //     Blend.Dom.setStyle(me.ghostEl, {
            //         top: 0,
            //         left: me.el.clientLeft -  bounds.left
            //     });
            // }
        }

        private createGhost() {
            var me = this;
            me.ghostEl = <HTMLElement>me.el.cloneNode(true);
            Blend.Dom.cssClass(me.ghostEl, <string>Blend.cssPrefix('splitter-ghost'));
            var bounds = <any>Blend.Dom.getStyle(me.el,['top','left']);
            Blend.Dom.setStyle(me.ghostEl, {
                position: 'absolute',
                display: 'none',
                left:bounds.left,
                top:bounds.top
            });
            me.el.parentElement.appendChild(me.ghostEl);
        }

        private activate(ev: MouseEvent) {
            var me = this;
            if (!me.isActive) {
                me.isActive = true;
                me.origin = { top: ev.screenY, left: ev.screenX };
                me.setCssClass({ [me.activeCssClass]: true });
                me.setCssClass({ [me.hoverCssClass]: false });
                me.positionGhost();
                me.moveHandlerFn = function(ev: MouseEvent) {
                    me.handleMovement.apply(me, arguments);
                }
                Blend.Dom.addEventListener(document, 'mousemove', me.moveHandlerFn);
            }
        }

        private deActivate(ev: MouseEvent) {
            var me = this;
            if (me.isActive) {
                me.isActive = false;
                me.setCssClass({ [me.activeCssClass]: false });
                me.setCssClass({ [me.hoverCssClass]: false });
                Blend.Dom.removeEventListener(document, 'mousemove', me.moveHandlerFn);
                Blend.Dom.setStyle(me.ghostEl, { display: 'none' }); // hide
            }
        }

        private initHoverEffect() {
            var me = this;
            Blend.Dom.addEventListener(me.el, 'mouseenter', function() {
                me.setCssClass({ [me.hoverCssClass]: true });
            });
            Blend.Dom.addEventListener(me.el, 'mouseleave', function() {
                me.setCssClass({ [me.hoverCssClass]: false });
            });
        }

        render(layoutConfig: CreateElementInterface = {}): HTMLElement {
            var me = this,
                spec = {
                    cls: Blend.cssPrefix(['splitter', 'splitter-' + me.splitType]),
                    innerHTML: '&nbsp;'
                }
            return me.createElement(Blend.apply(spec, layoutConfig));
        }
    }
}