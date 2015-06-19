///<reference path="../Blend.ts"/>
module Blend {
	export module utils {

		export class DomSingleton {

			getDocument(): HTMLElement {
				if (document) {
					return document.documentElement;
				} else {
					throw new Error('No document object available!');
				}
			}

			addEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
				el.addEventListener(eventName, eventHandler, false);
			}

			removeEventListener(el: EventTarget, eventName: string, eventHandler: EventListener): void {
				el.removeEventListener(eventName, eventHandler, false);
			}

			createElement(config: any): HTMLElement {
				var me = this;
				if (Blend.isObject(config)) {
					var el: HTMLElement = document.createElement(config.tag || 'div');
					for (var cfg in config) {
						var val = config[cfg];
						if (cfg !== 'tag' && cfg !== 'scope') {
							if (cfg === 'cls') {
								cfg = 'class';
								if (Blend.isArray(val)) {
									val = <Array<string>>val.join(' ');
								}
							} else if (cfg === 'text') {
								cfg = null;
								var textNd = document.createTextNode(val);
								el.appendChild(textNd);
							} else if (cfg === 'listeners' && Blend.isObject(val)) {
								cfg = null;
								for (var e in val) {
									var handler = val[e];
									me.addEventListener(el, e, function() {
										handler.apply(config.scope || window, arguments);
									});
								}
							} else if (cfg === 'children') {
								if (!Blend.isArray(val)) {
									val = [val];
								}
								val.forEach(function(child) {
									if (child instanceof HTMLElement) {
										el.appendChild(<HTMLElement>child);
									} else {
										el.appendChild(me.createElement(child));
									}
								});
								cfg = null;
							}
							if (cfg) {
								el.setAttribute(cfg, val);
							}
						}
					}
					return el;
				} else {
					return null;
				}
			}
		}
	}
	export var Dom = new utils.DomSingleton();
}