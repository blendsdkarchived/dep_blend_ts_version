///<reference path="View.ts"/>
///<reference path="../Blend.ts"/>
///<reference path="../utils/Dom.ts"/>
///<reference path="../layout/FitUtil.ts"/>

module Blend {
    export module ui {

        export interface IContainerConfig extends Blend.ui.IViewConfig {
            children?:Array<Blend.ui.View|Blend.ui.IViewConfig>;
        }

        export class Container extends Blend.ui.View implements IContainerConfig {

            children:Array<Blend.ui.View|Blend.ui.IViewConfig>;
            bodyElement:HTMLElement;

            constructor(config?:IContainerConfig) {
                var me = this;
                super(config);
            }

            parseConfigValue(key:string,value:any) {
                var me = this;
                if(key === 'children') {
                    var list = <Array<Blend.ui.View|Blend.ui.IViewConfig>>value,
                        result = [];
                    Blend.forEach(list,function(item){
                        if(Blend.isInstanceOf(item,Blend.ui.View)) {
                            (<Blend.ui.View>item).parent = me;
                            result.push(item);
                        } else {
                            item.parent = me;
                            var view = <Blend.ui.View>Blend.createObjectWithAlias(Blend.getAlias(item),item);
                            result.push(view);
                        }
                    });
                    return result;
                } else {
                    return value;
                }
            }

            layoutInnerElements() {
                var me =  this;
                Blend.layout.utils.fitUtil(me.bodyElement);
            }

            layoutView() {
                var me = this;
                me.layoutInnerElements();
                super.layoutView.apply(me,arguments);
            }

            renderBodyElement() {
                return {
                    oid:'bodyElement',
                    cls:[Blend.cssPrefix('bodyel')],
                    extra: {
                        'data-scroll':'none'
                    }
                }
            }

            render() {
                var me = this,
                el = me.createElement({
                    cls:[Blend.cssPrefix('cntnr')],
                    children:[
                        me.renderBodyElement()
                    ]
                },function(el:HTMLElement,oid:string){
                    me[oid] = el;
                },me);
                Blend.forEach(me.children,function(view:Blend.ui.View){
                    me.bodyElement.appendChild(view.getElement());
                });
                return el;
            }
        }

        Blend.registerClassWithAlias('ui.container',Container);
    }
}