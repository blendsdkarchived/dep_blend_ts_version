module Blend {
	export module testing {

		export interface TestConfig {
			category:string;
			name:string;
			testFn:(t:TestRunnerSingleton) => void
			pass:number;
			fail:number;
			testn?:number;
		}

		export class TestRunnerSingleton {

			tests:Array<TestConfig>
			testStarted:boolean = false;
			nextTextIndex:number = 0;
			currentTest:TestConfig;
			testLog:HTMLElement;
			totals:HTMLElement;
			totalPass:number = 0;
			totalFail:number = 0;
			totalTests:number = 0;
			defaultDelayAmount:number = 100;

			constructor() {
				var me  = this;
				me.tests = [];
				me.totals = me.createTotals();
				me.testLog = document.createElement('div');
				me.testLog.setAttribute('class','testlog');
				me.testLog.appendChild(me.totals);
			}

			equal(actual:any, expected:any, message?:string) {
				var me = this,
					type = 'IS EQUAL?';
				var check = function (a:any, b:any):boolean {
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
							bkeys = Object.keys(a);
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

				if (check(actual, expected)) {
					me.pass(type,message);
				} else {
					me.fail.apply(me, [type,actual,expected,message]);
				}
			}


			delay(fn:Function, amount?:number) {
				var me = this,
				curTitle = document.title;
				amount = amount || me.defaultDelayAmount;

				document.title = `${amount} delay for ${me.currentTest.name}`;
				setTimeout(function(){
					fn();
					document.title = curTitle;
				}, amount);
			}


			isOk(actuall:any, message?:string) {
				var me = this,
				type = 'IS OK?';
				if (actuall !== null && actuall !== undefined) {
					me.pass(type,message);
				} else {
					me.fail.apply(me, [type,actuall, 'not null/undefined', message]);
				}
			};

			isNotOk(actuall:any, message?:string) {
				var me = this,
				type = 'IS NOT OK?';
				if (actuall === null || actuall === undefined) {
					me.pass(type,message);
				} else {
					me.fail.apply(me, [type,actuall, 'null/undefined', message]);
				}
			};

			isTrue(actuall:boolean, message?:string) {
				var me = this,
				type = 'IS TRUE?';
				if (actuall === true) {
					me.pass(type,message);
				} else {
					me.fail.apply(me, [type,actuall, true, message]);
				}
			}

			isFalse(actuall:boolean, message?:string) {
				var me = this,
				type ='IS FALSE?';
				if (actuall === false) {
					me.pass(type,message);
				} else {
					me.fail.apply(me, [type,actuall, true, message]);
				}
			}

			defineTest(category:string,name:string,fn:(t:TestRunnerSingleton) => void ) {
				var me = this;
				me.tests.push({
					category:category,
					name:name,
					testFn:fn,
					pass:0,
					fail:0,
					testn:0
				});
			}

			logPass(...args:Array<any>) {
				var me = this,
				el = document.createElement('div');
				el.setAttribute('class','log-message log-pass');
				el.innerHTML = '<span class="type">PASS</span><span class="message">' + args.join(' ') + '</span>';
				me.testLog.appendChild(el);
			}

			logFail(...args:Array<any>) {
				var me = this,
				el = document.createElement('div');
				el.setAttribute('class','log-message log-fail');
				el.innerHTML = '<span class="type">FAILED</span><span class="message">' + args.join(' ') + '</span>';
				me.testLog.appendChild(el);
			}


			logError(...args:Array<any>) {
				var me = this,
				el = document.createElement('div');
				el.setAttribute('class','log-message log-error');
				el.innerHTML = '<span class="type">ERROR</span><span class="message">' + args.join(' ') + '</span>';
				me.testLog.appendChild(el);
			}

			logWarn(...args:Array<any>) {
				var me = this,
				el = document.createElement('div');
				el.setAttribute('class','log-message log-warn');
				el.innerHTML = '<span class="type">WARN</span><span class="message">' + args.join(' ') + '</span>';
				me.testLog.appendChild(el);
			}

			logInfo(...args:Array<any>) {
				var me = this,
				el = document.createElement('div');
				el.setAttribute('class','log-message log-info');
				el.innerHTML = '<span class="type">INFO</span><span class="message">' + args.join(' ') + '</span>';
				me.testLog.appendChild(el);
			}

			done() {
				var me = this;
				if (me.currentTest.pass === 0 && me.currentTest.fail === 0) {
					me.logWarn('Nothing was tested!!!');
				}
				me.nextTextIndex++;
				me.runNextTest();
			};

			pass(test:string,message?:string) {
				var me = this;
				me.currentTest.pass++;
				me.totalPass++;
				me.logPass(test + '  ' + (message || 'Test ' + me.currentTest.testn)) ;
				me.currentTest.testn++;
				me.totalTests++;
			};

			fail(test:string,actual:any, expected:any, message?:string) {
				var me = this;
				me.currentTest.fail++;
				me.totalFail++;
				me.logFail(test + '  ' + ((message || 'Test ' + me.currentTest.testn) + ' : got [' + actual + '] expected [' + expected + ']'));
				me.currentTest.testn++;
				me.totalTests++;
			}

			runNextTest() {
				var me = this;
				me.currentTest = me.tests[me.nextTextIndex];
				if(me.currentTest) {
					me.logInfo(`Running  test [${me.currentTest.name}] in category [${me.currentTest.category}]`);
					try {
						me.currentTest.testFn.apply(me,[me]);
					} catch(e) {
						me.logError(e);
						me.showResults();
					}
				} else {
					me.showResults();
				}

			}

			showResults() {
				var me = this;
				me.logInfo('All Done.');
				document.body.innerHTML = '';
				me.totals.innerHTML = me.createTotals().innerHTML;
				document.body.appendChild(me.testLog);
			}

			createTotals():HTMLElement {
				var me = this,
				el = document.createElement('div');
				el.setAttribute('class','totals');
				var pass = 'PASS: '  + me.totalPass;
				var fail = 'FAILED: ' + me.totalFail;
				el.innerHTML = `<span class="total">TOTAL: ${me.totalTests}</span><span class="pass">${pass}</span><span class="fail">${fail}</span>`;
				return el;
			}

			is_array(value:any):boolean {
				return Object.prototype.toString.apply(value) === '[object Array]';
			};


			is_function(value:any):boolean {
				return typeof (value) === 'function';
			};

			is_string(value:any):boolean {
				return typeof value === 'string';
			};

			is_null(value:any):boolean {
				return value === null || value === undefined;
			};

			is_object(value:any):boolean {
				var me = this;
				return (typeof (value) === "object" &&
					!me.is_array(value) &&
					!me.is_function(value) &&
					!me.is_null(value) &&
					!me.is_string(value)
					);
			};

			is_number(value:any):boolean {
				// Original source: JQuery
				return value - parseFloat(value) >= 0;
			};

			is_regexp(value:any):boolean {
				return (value instanceof RegExp);
			};

			get_obj_type(obj:any):string {
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
			};

			run() {
				var me = this;
				me.logInfo('Welcome to BlendSDK Testing :)');
				var doCallback = function () {
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
				};

				if (document.readyState === "complete") {
					setTimeout(doCallback, 5);
				} else {
					me.addEventListener(document, 'DOMContentLoaded', doCallback);
					me.addEventListener(window, 'load', doCallback);
				}
			}

			addEventListener(el: EventTarget, eventName: string, eventHandler: EventListenerOrEventListenerObject ): void {
				el.addEventListener(eventName, eventHandler, false);
			}

			removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListenerOrEventListenerObject): void {
				el.removeEventListener(eventName, eventHandler, false);
			}

		}
	}
}