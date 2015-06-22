///<reference path="View.ts"/>
///<reference path="../Blend.ts"/>
///<reference path="../utils/Dom.ts"/>
///<reference path="../layout/FitUtil.ts"/>

module Blend {
    export module ui {

        export interface IContainerConfig extends Blend.ui.IViewConfig {
            children?: Array<Blend.ui.View|Blend.ui.IViewConfig>;
        }

        export interface IContainer {
            bodyElement: HTMLElement;
            bodyContentElement: HTMLElement;
            children: Array<Blend.ui.View|Blend.ui.IViewConfig>;
        }

        export class Container extends Blend.ui.View implements IContainerConfig, IContainer {

            children: Array<Blend.ui.View|Blend.ui.IViewConfig>;
            bodyElement: HTMLElement;
            bodyContentElement: HTMLElement;
            bodyPadding: number;


            constructor(config?: IContainerConfig) {
                var me = this;
                me.defaultLayout = 'container';
                super(config);
            }

            parseConfigValue(key: string, value: any) {
                var me = this;
                if (key === 'children') {
                    var list = <Array<Blend.ui.View|Blend.ui.IViewConfig>>value,
                        result = [];
                    Blend.forEach(list, function(item) {
                        if (Blend.isInstanceOf(item, Blend.ui.View)) {
                            (<Blend.ui.View>item).parent = me;
                            result.push(item);
                        } else {
                            item.parent = me;
                            var view = <Blend.ui.View>Blend.createObjectWithAlias(Blend.getAlias(item), item);
                            result.push(view);
                        }
                    });
                    return result;
                } else {
                    return value;
                }
            }

            layoutInnerElements() {
                var me = this;
                Blend.layout.utils.fitUtil(me.bodyElement);
            }

            layoutView() {
                var me = this;
                me.layoutInnerElements();
                super.layoutView.apply(me, arguments);
            }

            renderBodyElement(): any {
                var me = this;
                return {
                    oid: 'bodyElement',
                    cls: [Blend.cssPrefix('body')],
                    style: {
                        padding: me.bodyPadding
                    },
                    children: [
                        {
                            cls: Blend.cssPrefix(['body-inner','fitted']),
                            oid: 'bodyContentElement',
                        }
                    ]
                }
            }

            render(layoutConfig?: Blend.utils.ICreateElement) {
                var me = this,
                    spec = Blend.apply(layoutConfig || {}, {
                        cls: Blend.cssPrefix('cntnr', true),
                        children: [
                            me.renderBodyElement()
                        ]
                    },true,true),
                    el = me.createElement(spec, function(el: HTMLElement, oid: string) {
                        me[oid] = el;
                    }, me);
                return el;
            }
        }

        Blend.registerClassWithAlias('ui.container', Container);
    }
}