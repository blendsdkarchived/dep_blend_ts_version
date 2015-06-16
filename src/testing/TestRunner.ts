module Blend {
	export module testing {

		export class TestRunnerSingleton {

			run() {

			}


			addEventListener(el: EventTarget, eventName: string, eventHandler: EventListenerOrEventListenerObject ): void {
				el.addEventListener(eventName, eventHandler, false);
			}

			removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListenerOrEventListenerObject): void {
				el.removeEventListener(eventName, eventHandler, false);
			}

		}

		export var TestRunner = new TestRunnerSingleton();
	}
}