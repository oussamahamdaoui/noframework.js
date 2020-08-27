export function $(selector: string, element?: Node): Node | null;

export function $$(selector: string, element?: Node): [Node];

export function html(stringParts: [string], ...inBetweens: [Node] | Node | Promise | any): Node;

export function emptyElement(element: Node): void;

export class EventManager {
  constructor();
  unsubscribe(eventName: string, callBack: function): void;
  subscribe(eventName: string, callBack: function): void;
  clearEvent(eventName: string): void;
  emit(eventName: string, ...params: any): void;
}

export function cache(fn: function, storageTime: number): function;

export function escape(string: string): string;

export class Router{
  constructor(eventManager: EventManager, pageNotFound: string);
  set(pageName: string, component: Node, routingFunction: (location: Location, pageName: string) => boolean):void;
  init(): void;
}
