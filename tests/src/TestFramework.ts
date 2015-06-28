module Blend.testing {

    export interface TestConfig {
        name: string;
        testFn: (t: TestRunner) => void
        pass: number;
        fail: number;
        testn?: number;
    }

    export class TestRunner {

        tests: Array<TestConfig>
        testStarted: boolean = false;
        nextTextIndex: number = 0;
        currentTest: TestConfig;
        totalPass: number = 0;
        totalFail: number = 0;
        totalTests: number = 0;
        defaultDelayAmount: number = 100;
        log: Array<string>;

        constructor() {
            var me = this;
            me.tests = [];
            me.log = [];
        }

        /**
         * Defines a test case
         */
        defineTest(name: string, fn: (t: TestRunner) => void) {
            var me = this;
            me.tests.push({
                name: name,
                testFn: fn,
                pass: 0,
                fail: 0,
                testn: 0
            });
        }

        /**
         * Execute a function and expects an exception be to thrown
         */
        throws_exception(actual: Function, message?: string) {
            var me = this,
                type = "Throws an exception";
            try {
                actual();
                me.fail(type, 'exception', 'no exception', message);
            } catch (e) {
                me.pass(type, message);
            }
        }

        /**
         * Executes the given function with delay
         */
        delay(fn: Function, amount?: number) {
            var me = this,
                curTitle = document.title;
            amount = amount || me.defaultDelayAmount;

            document.title = `${amount} delay for ${me.currentTest.name}`;
            setTimeout(function() {
                fn();
                document.title = curTitle;
            }, amount);
        }

        /**
         * Check if the value is true
         */
        isTrue(actuall: boolean, message?: string) {
            var me = this,
                type = 'Is True';
            if (actuall === true) {
                me.pass(type, message);
            } else {
                me.fail.apply(me, [type, actuall, true, message]);
            }
        }

        /**
         * Check if the value is false;
         */
        isFalse(actuall: boolean, message?: string) {
            var me = this,
                type = 'Is False';
            if (actuall === false) {
                me.pass(type, message);
            } else {
                me.fail.apply(me, [type, actuall, true, message]);
            }
        }

        /**
         * Check if the value is null or undefined
         */
        isNotOk(actuall: any, message?: string) {
            var me = this,
                type = 'IS NOT OK?';
            if (actuall === null || actuall === undefined) {
                me.pass(type, message);
            } else {
                me.fail.apply(me, [type, actuall, 'null/undefined', message]);
            }
        }


        /**
         * Check if the value is not null or undefined
         */
        isOk(actuall: any, message?: string) {
            var me = this,
                type = 'Is Okay';
            if (actuall !== null && actuall !== undefined) {
                me.pass(type, message);
            } else {
                me.fail.apply(me, [type, actuall, 'not null/undefined', message]);
            }
        }


        /**
         * Should be called after a test is done to let the test runner to continue
         */
        done() {
            var me = this;
            if (me.currentTest.pass === 0 && me.currentTest.fail === 0) {
                me.logWarn('Nothing was tested!!!');
            }
            me.nextTextIndex++;
            me.runNextTest();
        }

        /**
         * Compares to objects to for equality
         */
        equal(actual: any, expected: any, message?: string) {
            var me = this,
                type = 'Equal'
            if (me._equal(actual, expected, message)) {
                me.pass(type, message);
            } else {
                me.fail.apply(me, [type, actual, expected, message]);
            }
        }

        /**
         * Compares to objects to for equality
         */
        notEqual(actual: any, expected: any, message?: string) {
            var me = this,
                type = 'Not Equal'
            if (!me._equal(actual, expected, message)) {
                me.pass(type, message);
            } else {
                me.fail.apply(me, [type, actual, expected, message]);
            }
        }

        private _equal(actual: any, expected: any, message?: string) {
            var me = this;
            var check = function(a: any, b: any): boolean {
                if (me.get_obj_type(a) === me.get_obj_type(b)) {
                    if (me.is_array(a)) {
                        if (a.length === b.length) {
                            for (var i = 0; i !== a.length; i++) {
                                if (!check(a[i], b[i])) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return false;
                        }
                    } else if (me.is_object(a)) {
                        var akeys = Object.keys(a),
                            bkeys = Object.keys(b);
                        if (akeys.length === bkeys.length) {
                            for (var k in a) {
                                if (!check(a[k], b[k])) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return false;
                        }

                    } else if (me.is_function(a)) {
                        return a.length === b.length;
                    } else if (me.is_regexp(a)) {
                        throw new Error("Don't know how to compare RegExps!");
                    } else {
                        return a === b;
                    }
                } else {
                    return false;
                }
            };
            return check(actual, expected);
        }

        private pass(test: string, message?: string) {
            var me = this;
            me.currentTest.pass++;
            me.totalPass++;
            me.currentTest.testn++;
            me.totalTests++;
        }

        private fail(test: string, actual: any, expected: any, message?: string) {
            var me = this;
            me.currentTest.fail++;
            me.totalFail++;
            me.logFail(test, actual, expected, message || 'Test #' + me.currentTest.testn);
            me.currentTest.testn++;
            me.totalTests++;
        }

        private span(cls: string, content: any) {
            return `<span class="${cls}">${content}</span>`;
        }

        private row(cls: string, content: Array<any>) {
            return `<div class="row ${cls}">${content.join('') }</div>`;
        }

        private logFail(testtype: string, actual: any, expected: any, message?: string) {
            var me = this;
            me.log.push(
                me.row('fail', [
                    me.span('type pct10', testtype),
                    me.span('message pct10', message),
                    me.span('got pct40', `got: [${JSON.stringify(actual) }]`),
                    me.span('expected pct40', `expected: [${JSON.stringify(expected) }]`)
                ])
                );
        }

        logWarn(message: string) {
            var me = this;
            me.log.push(me.row('warn', [message]));
        }

        private is_array(value: any): boolean {
            return Object.prototype.toString.apply(value) === '[object Array]';
        }


        private is_function(value: any): boolean {
            return typeof (value) === 'function';
        }

        private is_string(value: any): boolean {
            return typeof value === 'string';
        }

        private is_null(value: any): boolean {
            return value === null || value === undefined;
        }

        private is_object(value: any): boolean {
            var me = this;
            return (typeof (value) === "object" &&
                !me.is_array(value) &&
                !me.is_function(value) &&
                !me.is_null(value) &&
                !me.is_string(value)
                );
        }

        private is_number(value: any): boolean {
            // Original source: JQuery
            return value - parseFloat(value) >= 0;
        }

        private is_regexp(value: any): boolean {
            return (value instanceof RegExp);
        }

        private get_obj_type(obj: any): string {
            var me = this;
            if (me.is_string(obj)) {
                return 'string';
            } else if (me.is_array(obj)) {
                return 'array';
            } else if (me.is_number(obj)) {
                return 'number';
            } else if (me.is_object(obj)) {
                return 'object';
            } else if (me.is_function(obj)) {
                return 'function';
            } else if (me.is_null(obj)) {
                return 'null';
            } else if (me.is_regexp(obj)) {
                return 'regexp';
            }
        }

        public run() {
            var me = this;
            var doCallback = function() {
                if (!me.testStarted) {
                    me.removeEventListener(document, 'DOMContentLoaded', doCallback);
                    me.removeEventListener(window, 'load', doCallback);
                    me.testStarted = true;
                    if (me.tests.length !== 0) {
                        me.runNextTest();
                    } else {
                        me.logWarn("No tests not run!");
                    }
                }
            }

            if (document.readyState === "complete") {
                setTimeout(doCallback, 5);
            } else {
                me.addEventListener(document, 'DOMContentLoaded', doCallback);
                me.addEventListener(window, 'load', doCallback);
            }
        }

        private showResults() {
            var me = this, result: Array<string> = [];
            result.push(me.row(`totals ${me.totalFail === 0 ? 'allpass' : 'somefailed' }`, [
                me.span('numtest pct33', `Total: ${me.totalTests}`),
                me.span('failed pct33', `Failed: ${me.totalFail}`),
                me.span('passed pct33', `Passed: ${me.totalPass}`)
            ]));
            result = result.concat(me.log);
            document.body.innerHTML = `<div class='log'>${result.join(' ') }</div>`;
        }

        private runNextTest() {
            var me = this;
            me.currentTest = me.tests[me.nextTextIndex];
            if (me.currentTest) {
                me.currentTest.testFn.apply(me, [me]);
            } else {
                me.showResults();
            }
        }

        private addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.addEventListener(eventName, eventHandler, false);
        }

        private removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
            el.removeEventListener(eventName, eventHandler, false);
        }
    }
}

var TestRunner = new Blend.testing.TestRunner();