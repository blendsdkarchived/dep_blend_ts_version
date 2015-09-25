/// <reference path="layout/Layout"/>
/// <reference path="layout/container/Layout" />
/// <reference path="layout/container/box/Horizontal"/>
/// <reference path="layout/container/box/Vertical"/>
/// <reference path="ui/container/View"/>
/// <reference path="ui/Rectangle"/>
/// <reference path="ui/Spacer"/>
/// <reference path="ui/splitter/Splitter"/>
/// <reference path="ui/panel/Panel" />


Blend.registerClassWithAlias('layout.default', Blend.layout.Layout);
Blend.registerClassWithAlias('layout.container', Blend.layout.container.Layout);
Blend.registerClassWithAlias('layout.hbox', Blend.layout.container.box.Horizontal);
Blend.registerClassWithAlias('layout.vbox', Blend.layout.container.box.Vertical);
Blend.registerClassWithAlias('ui.container', Blend.ui.container.View);
Blend.registerClassWithAlias('ui.spacer', Blend.ui.Spacer);
Blend.registerClassWithAlias('ui.splitter', Blend.ui.splitter.Splitter);
Blend.registerClassWithAlias('ui.panel', Blend.ui.panel.Panel);
Blend.registerClassWithAlias('ui.rect', Blend.ui.Rectangle);