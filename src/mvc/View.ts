module Blend.mvc {
    export class View {

        private reference:string;

        /**
         * Retrives the refenece key of this View
         */
        public getReference() {
            var me = this;
            return me.reference;
        }

    }
}