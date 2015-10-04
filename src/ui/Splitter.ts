/// <reference path="../Blend" />
/// <reference path="../dom/Dom" />
/// <reference path="View" />
/// <reference path="../interface/SplitterConfigInterface" />
/// <reference path="../interface/ViewBoundsInterface" />
/// <reference path="Container" />


module Blend.ui {

    export class Splitter extends Blend.ui.View {

        protected initialConfig: SplitterConfigInterface;
        protected activeCssClass: string;
        protected hoverCssClass: string;
        protected cursorCssClass: string;
        protected isActive: boolean;
        protected ghostEl: HTMLElement;
        protected origin: ViewBoundsInterface;
        protected curPosition: ViewBoundsInterface;
        protected moveHandlerFn: EventListener;
        protected beforeView: Blend.ui.View;
        protected afterView: Blend.ui.View;
        protected positionProperty: string;
        protected sizeProperty: string;
        protected movementProperty: string;
        protected beforeSizeLimit: number;
        protected afterSizeLimit: number;
        protected currentDisplacement: number;
        protected beforeBounds: ViewBoundsInterface;
        protected afterBounds: ViewBoundsInterface;

        constructor(config?: SplitterConfigInterface) {
            var me = this;
            super(config);

            me.activeCssClass = <string>Blend.cssPrefix('splitter-active');
            me.hoverCssClass = <string>Blend.cssPrefix('splitter-hover');
            me.isActive = false;
            me.ghostEl = null;
            me.cursorCssClass = <string>Blend.cssPrefix('splitter-' + me.initialConfig.splitType + '-cursor');

            if (me.initialConfig.splitType === 'hbox') {
                me.positionProperty = 'left';
                me.sizeProperty = 'width';
                me.movementProperty = 'screenX';
            } else {
                me.positionProperty = 'top';
                me.sizeProperty = 'height';
                me.movementProperty = 'screenY';
            }

            me.cssClass = Blend.cssPrefix(['splitter', 'splitter-' + me.initialConfig.splitType]);
        }

        /**
         * Bind Views before and after this splitter so we can process them later
         */
        bindAdjacentViews(beforeView: Blend.ui.View, afterView: Blend.ui.View) {
            var me = this;
            me.beforeView = beforeView;
            me.afterView = afterView;
        }

        /**
         * Move the ghost element and enforce the minimal View sizes
         */
        private handleMovement(ev: MouseEvent) {
            var me = this,
                move: boolean = false,
                movementPosition = (<any>ev)[me.movementProperty],
                newSize: number,
                displacement = movementPosition - (<any>me.origin)[me.positionProperty]

            if (displacement < 0) {
                // towards before View
                move = ((<any>me.beforeBounds)[me.sizeProperty] - Math.abs(displacement)) > me.beforeSizeLimit;
            } else if (displacement > 0) {
                // towards after View
                move = ((<any>me.afterBounds)[me.sizeProperty] - Math.abs(displacement)) > me.afterSizeLimit;
            }

            if (move) {
                me.currentDisplacement = displacement;
                setTimeout(function() {
                    Blend.Dom.setStyle(me.ghostEl, {
                        [me.positionProperty]: (<any>me.curPosition)[me.positionProperty] + displacement
                    });
                }, 2);
            }
        }

        /**
         * Position the ghost element on top of this splitter
         */
        private positionGhost() {
            var me = this;
            if (!me.ghostEl) {
                me.createGhost();
            }
            var bounds = me.getBounds();
            Blend.Dom.setStyle(me.ghostEl, {
                display: 'block',
                left: bounds.left,
                top: bounds.top
            });
            me.curPosition = bounds;
        }

        /**
         * Create a ghost element that will act as a visual cue
         */
        private createGhost() {
            var me = this;
            me.ghostEl = <HTMLElement>me.el.cloneNode(true);
            Blend.Dom.cssClass(me.ghostEl, <string>Blend.cssPrefix('splitter-ghost'));
            me.el.parentElement.appendChild(me.ghostEl);
        }

        /**
         * Calculate the limita in which this splitter can move
         */
        private prepareMovementLimits() {
            var me = this,
                minProperty = 'min' + Blend.ucFirst(me.sizeProperty);

            me.beforeBounds = me.beforeView.getBounds();
            me.afterBounds = me.afterView.getBounds();

            me.beforeSizeLimit = me.beforeView.getInitialConfig<number>(minProperty) || 0;
            me.afterSizeLimit = me.afterView.getInitialConfig<number>(minProperty) || 0;
        }

        /**
         * Kicks in the splitter movement
         */
        private activate(ev: MouseEvent) {
            var me = this;
            if (!me.isActive) {
                me.currentDisplacement = 0;
                me.isActive = true;
                me.origin = { top: ev.screenY, left: ev.screenX };
                me.setCssClass({ [me.activeCssClass]: true, [me.cursorCssClass]: true });
                me.setCssClass({ [me.hoverCssClass]: false });
                me.positionGhost();
                me.prepareMovementLimits();
                me.moveHandlerFn = function(ev: MouseEvent) {
                    me.handleMovement.apply(me, arguments);
                }
                Blend.Dom.addEventListener(document, 'mousemove', me.moveHandlerFn);
            }
        }

        /**
         * Finished the splitter movement
         */
        private deActivate(ev: MouseEvent) {
            var me = this;
            if (me.isActive) {
                me.isActive = false;
                me.setCssClass({ [me.activeCssClass]: false, [me.cursorCssClass]: false });
                me.setCssClass({ [me.hoverCssClass]: false });
                me.resizeViews();
                Blend.Dom.removeEventListener(document, 'mousemove', me.moveHandlerFn);
                Blend.Dom.setStyle(me.ghostEl, { display: 'none' }); // hide
                (<Blend.ui.View>me.parent).invalidateLayout(true);  // force to perform layout
            }
        }


        /**
         * Resizes the before and the after View by changes the View sizes
         */
        private resizeViews() {
            var me = this,
                reszie = Math.abs(me.currentDisplacement),
                beforeSize: number,
                afterSize: number;
            if (me.currentDisplacement !== 0) {
                me.beforeView.suspendLayout();
                me.afterView.suspendLayout();
                if (me.currentDisplacement > 0) {
                    beforeSize = (<any>me.beforeBounds)[me.sizeProperty] + reszie;
                    afterSize = (<any>me.afterBounds)[me.sizeProperty] - reszie;
                } else {
                    beforeSize = (<any>me.beforeBounds)[me.sizeProperty] - reszie;
                    afterSize = (<any>me.afterBounds)[me.sizeProperty] + reszie;
                }

                me.beforeView.setBounds({ [me.sizeProperty]: beforeSize });
                me.afterView.setBounds({ [me.sizeProperty]: afterSize });
                me.adjustFlexValue(me.beforeView, beforeSize);
                me.adjustFlexValue(me.afterView, afterSize);

                me.beforeView.invalidateLayout();
                me.afterView.invalidateLayout();
                me.beforeView.resumeLayout();
                me.afterView.resumeLayout();
            }
        }

        /**
         * Recalculate the View flexed sized if possible
         */
        private adjustFlexValue(view: Blend.ui.View, size: number) {
            var me = this,
                flex = view.getInitialConfig<number>('flex'),
                flexPerPixel: number;
            if (flex !== null) {
                view.setInitialConfig('flex', view.getAttribute<number>('flexPerPixel') * size);
            }
        }

        /**
         * Creates a hover effect for when the mouse is hovering over this splitter
         */
        private initHoverEffect() {
            var me = this;
            Blend.Dom.addEventListener(me.el, 'mouseenter', function() {
                me.setCssClass({ [me.hoverCssClass]: true });
            });
            Blend.Dom.addEventListener(me.el, 'mouseleave', function() {
                me.setCssClass({ [me.hoverCssClass]: false });
            });
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


    }
}