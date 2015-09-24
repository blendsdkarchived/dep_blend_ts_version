/// <reference path="{{ refRoot }}Blend" />
/// <reference path="{{ interfaceFileLocation }}" />

module {{ namespaceName }} {

    /**
     * Class {{ fullName }}
     */
    export class {{ className }} extends {{ parentClass }} {

        protected initialConfig: {{ interfaceName }};

        constructor(config?: {{ interfaceName }}) {
            var me = this;
            super(config);
        }

        protected initConfig(config?: {{ interfaceName }}) {

            var defaultConfig: {{ interfaceName }} = {
            };

            return Blend.apply(Blend.apply(super.initConfig(), defaultConfig, true), config || {}, true);
        }

        render(layoutConfig: CreateElementInterface = {}): HTMLElement {
            var me = this,
                spec = {
                }
            return me.createElement(Blend.apply(spec, layoutConfig));
        }

        finalizeRender() {
            var me = this;
            super.finalizeRender();
        }
    }
}