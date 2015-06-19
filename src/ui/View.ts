///<reference path="../mvc/View.ts"/>
///<reference path="../layout/Layout.ts"/>
module Blend {
	export module ui {

		export interface IViewConfig extends Blend.mvc.IViewConfig {
			layoutConfig?: Blend.layout.ILayoutConfig
		}

		export class View extends Blend.mvc.View implements IViewConfig {

			el: HTMLElement;
			rendered: boolean = false;
			layout: Blend.layout.Layout;
			private _canLayout: boolean = true;
			private _sizeSig: string;

			constructor(config?: IViewConfig) {
				super(config);
				var me = this;
				me.layout = Blend.layout.createLayout(config.layoutConfig || { alias: 'default' }, me);
			}

			canLayout() {
				return this._canLayout;
			}

			suspendLayout() {
				this._canLayout = false;
			}

			resumeLayout() {
				this._canLayout = true;
			}

			doneLayout() {
				this._sizeSig = this.getSizeSig();
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
				return (me._sizeSig !== cur);;
			}

			private getSizeSig(): string {
				var me = this,
					cs = <CSSStyleDeclaration>Blend.Dom.style(me.el);
				return [cs.top, cs.left, cs.widows, cs.height, cs.padding, cs.margin].join('');
			}


			getElement(): HTMLElement {
				var me = this;
				if (!me.rendered) {
					me.rendered = true;
					me.el = me.layout.render();
				}
				return me.el;
			}

			render(): HTMLElement {
				throw new Error('Not Implemented Yet!');
			}
		}

	}
}