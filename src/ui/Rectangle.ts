///<reference path="View.ts"/>
///<reference path="../utils/Dom.ts"/>

module Blend {

    export module ui {

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

            render() {
                var me = this;
                return Blend.Dom.createElement({
                    style: {
                        width: me.width,
                        height: me.height,
                        'background-color': me.color || (me.color = me.getRandomColor()),
                        position: 'relative',
                        top: me.top,
                        left: me.left
                    }
                })
            }
        }

        Blend.registerClassWithAlias('ui.rect', Rectangle);
    }
}