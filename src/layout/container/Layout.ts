/// <reference path="../Layout.ts" />
/// <reference path="../../ui/Container.ts" />
module Blend {
    export module layout {
        export module container {

            export class Layout extends Blend.layout.Layout {

                view:Blend.ui.Container;

                constructor(config: ILayoutConfig, view: Blend.ui.View) {
                    var me = this;
                    super(config,view);
                }

                performLayout() {
                    var me = this;
                    Blend.forEach((<Blend.ui.Container>me.view).children,function(view:Blend.ui.View){
                        view.performLayout();
                    });
                    me.view.doneLayout();
                }

                render() {
                    var me = this;
                    var el:HTMLElement = super.render.apply(me,arguments);
                    Blend.forEach(me.view.children,function(item:Blend.ui.View){
                        me.view.bodyContentElement.appendChild(item.getElement());
                    });
                    return el;
                }

            }

            Blend.registerClassWithAlias('layout.container', Blend.layout.container.Layout);
        }
    }
}