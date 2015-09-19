/// <reference path="layout/Layout"/>
/// <reference path="layout/component/web/Application"/>
/// <reference path="layout/container/Layout" />
/// <reference path="layout/container/box/Horizontal"/>
/// <reference path="layout/container/box/Vertical"/>
/// <reference path="ui/ContainerView"/>
/// <reference path="ui/Rectangle"/>
/// <reference path="ui/Spacer"/>

Blend.registerClassWithAlias('layout.default', Blend.layout.Layout);
Blend.registerClassWithAlias('layout.application', Blend.layout.component.web.Application);
Blend.registerClassWithAlias('layout.container', Blend.layout.container.Layout);
Blend.registerClassWithAlias('layout.hbox', Blend.layout.container.box.Horizontal);
Blend.registerClassWithAlias('layout.vbox', Blend.layout.container.box.Vertical);
Blend.registerClassWithAlias('ui.container', Blend.ui.ContainerView);
Blend.registerClassWithAlias('ui.spacer', Blend.ui.Spacer);
Blend.registerClassWithAlias('ui.rect', Blend.ui.Rectangle);