///<reference path="View.ts"/>
///<reference path="../utils/Dom.ts"/>

module Blend.ui {

    export interface IRectangleConfig extends Blend.ui.IViewConfig {
        color?: string;
        width?: number;
        height?: number;
    }

    export class Rectangle extends Blend.ui.View {

        color: string = null;
        width: number = 150;
        height: number = 100;
        top: number = null;
        left: number = null;

        getRandomColor(): string {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        notifyClick() {
            var me = this;
            me.fireEvent('click', me.getBounds());
        }

        render(layoutConfig?: Blend.dom.ICreateElement) {
            var me = this,
                spec = Blend.apply(layoutConfig || {}, {
                    listeners: {
                        click: function(evt: Event) {
                            me.notifyClick();
                        }
                    },
                    style: {
                        width: me.width,
                        height: me.height,
                        'background-color': me.color || (me.color = me.getRandomColor()),
                        top: me.top,
                        left: me.left
                    }
                });
            return me.createElement(spec)
        }
    }
}
Blend.registerClassWithAlias('ui.rect', Blend.ui.Rectangle);