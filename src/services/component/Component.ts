import Handlebars from 'handlebars';
import { makeUUID } from '../../utils/makeUUID';
import EventBus from '../EventBus';
import { deepEqual } from '../../utils/deepEqual';
import { BlockProps, Children, Tag } from './types';

export class Component<T extends BlockProps = BlockProps> {
  static EVENTS = {
    INIT: 'init',
    CDM: 'flow:component-did-mount',
    CDU: 'flow:component-did-update',
    RENDER: 'flow:render',
  } as const;

  protected _element: HTMLElement | null = null;
  private readonly _eventBus: EventBus;
  private _id: string;
  private _tagName: Tag = 'div';
  props: BlockProps = {} as T;
  children: Children = {};

  constructor(_tagName: Tag, propsWithChildren = {}) {
    this._eventBus = new EventBus();
    const { props, children } = this._getPropsAndChildren(propsWithChildren);

    this.props = this._makePropsProxy(props);
    this.children = children;
    this._id = makeUUID();
    this._tagName = _tagName;

    this._registerEvents(this._eventBus);
    this._eventBus.emit(Component.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Component.EVENTS.CDM, this._componentDidMount.bind(this));
    eventBus.on(Component.EVENTS.CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Component.EVENTS.RENDER, this._render.bind(this));
  }

  _createResources() {
    const props = this.props;
    const tagName = this._tagName;
    this._element = this._createDocumentElement(tagName);
    if (typeof props.className === 'string') {
      const classes = props.className.split(' ');
      this._element?.classList.add(...classes);
    }
  }

  init() {
    this._createResources();
    this._eventBus.emit(Component.EVENTS.RENDER);
  }

  _getPropsAndChildren(propsAndChildrens: { [s: string]: unknown }) {
    const children: Children = {};
    const props: { [key: string]: unknown } = {};

    Object.entries(propsAndChildrens).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (obj instanceof Component) {
            children[key] = obj;
          } else {
            props[key] = obj;
          }
        });

        return;
      }

      if (value instanceof Component) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });
    return { props, children };
  }

  _makePropsProxy(props: { [key: string]: unknown }) {
    const eventBus = this._eventBus;
    const emitBinded = eventBus.emit.bind(eventBus);

    return new Proxy(props, {
      get(target: { [key: string]: object }, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },

      set(target: { [key: string]: object }, prop: string, value: object) {
        const oldTarget = { ...target };
        target[prop] = value;
        emitBinded(Component.EVENTS.CDU, oldTarget, target);
        return true;
      },

      deleteProperty() {
        throw new Error('No access');
      },
    });
  }

  _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  get element() {
    return this._element;
  }

  _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  private _compile() {
    const propsAndStubs: Record<string, unknown> = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(
          (component) => `<div data-id="${component._id}"></div>`
        );
      } else {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
      }
    });

    const fragment = this._createDocumentElement('template');
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component._id}"]`
          );
          stub?.replaceWith(component.getContent());
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
        stub?.replaceWith(child.getContent());
      }
    });

    return fragment.content;
  }

  private _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  protected componentDidMount() {}

  dispatchComponentDidMount(): void {
    this._eventBus.emit(Component.EVENTS.CDM);
  }

  private _componentDidUpdate(oldProps?: object, newProps?: object) {
    const isNeedRender = this.componentDidUpdate(oldProps, newProps);
    if (isNeedRender) {
      this._render();
    }
  }

  componentDidUpdate(oldProps?: object, newProps?: object): boolean {
    return !deepEqual(oldProps, newProps);
  }

  private _render() {
    this._removeEvents();
    const block = this._compile();

    if (this._element?.childNodes.length === 0) {
      this._element.appendChild(block);
    } else {
      this._element?.replaceChildren(block);
    }

    this._addEvents();
  }

  protected render(): string {
    return '';
  }

  getContent() {
    return this.element as HTMLElement;
  }
}

// export interface BaseProps {
//   settings?: {
//     withInternalID?: boolean;
//   };
//   events?: Record<string, EventListener>;
//   attrs?: Record<string, string>;
// }

// export type ComponentChildren<C extends Record<string, Component<any, any>>> =
//   C;

// interface ComponentEvents<P> extends Record<string, unknown> {
//   init: [];
//   'flow:component-did-mount': [];
//   'flow:component-did-update': [
//     oldP: P & { _id: string },
//     newP: P & { _id: string }
//   ];
//   'flow:render': [];
// }

// export class Component<
//   P extends BaseProps = {},
//   C extends Record<string, Component<any, any>> = {}
// > {
//   static EVENTS = {
//     INIT: 'init',
//     CDM: 'flow:component-did-mount',
//     CDU: 'flow:component-did-update',
//     RENDER: 'flow:render',
//   } as const;

//   private _props: P & { _id: string };
//   private _children: Partial<C>;
//   private _id: string;
//   private _element!: HTMLElement;
//   private _meta: { tag: string; props: P };
//   private _eventBus: EventBus<ComponentEvents<P>>;
//   private _setUpdate = false;

//   constructor(
//     tag: string = 'div',
//     propsAndChildren: P & Partial<{ [K in keyof C]: C[K] }> = {} as any
//   ) {
//     this._id = makeUUID();
//     const { children, props } = this.splitPropsAndChildren(propsAndChildren);

//     this._eventBus = new EventBus<ComponentEvents<P>>();
//     this._children = this.createChildrenProxy(children);
//     this._props = this.createPropsProxy({ ...props, _id: this._id });
//     this._meta = { tag, props };

//     this.registerEvents();
//     this._eventBus.emit(Component.EVENTS.INIT);
//   }

//   private registerEvents(): void {
//     this._eventBus.on('init', this.init.bind(this));
//     this._eventBus.on(
//       'flow:component-did-mount',
//       this._componentDidMount.bind(this)
//     );
//     this._eventBus.on(
//       'flow:component-did-update',
//       this._componentDidUpdate.bind(this)
//     );
//     this._eventBus.on('flow:render', this._render.bind(this));
//   }

//   private init(): void {
//     this._element = this.createDocumentElement(this._meta.tag);
//     this._eventBus.emit(Component.EVENTS.RENDER);
//   }

//   private createDocumentElement(tag: string): HTMLElement {
//     const el = document.createElement(tag);
//     if (this._props.settings?.withInternalID) {
//       el.setAttribute('data-id', this._id);
//     }
//     return el;
//   }

//   private _render(): void {
//     const html = this.render();
//     this.removeEvents();
//     this._element.innerHTML = html;
//     this.addAttributes();
//     this.addEvents();
//   }

//   protected render(): string {
//     return '';
//   }

//   private addEvents(): void {
//     for (const [evt, handler] of Object.entries(this._props.events ?? {})) {
//       this._element.addEventListener(evt, handler);
//     }
//   }

//   private removeEvents(): void {
//     for (const [evt, handler] of Object.entries(this._props.events ?? {})) {
//       this._element.removeEventListener(evt, handler);
//     }
//   }

//   private addAttributes(): void {
//     for (const [attr, val] of Object.entries(this._props.attrs ?? {})) {
//       this._element.setAttribute(attr, val);
//     }
//   }

//   private splitPropsAndChildren(input: P & Partial<{ [K in keyof C]: C[K] }>): {
//     props: P;
//     children: Partial<C>;
//   } {
//     const props: Partial<P> = {};
//     const children: Partial<C> = {};
//     for (const key in input) {
//       const val = (input as unknown as Record<string, unknown>)[key];
//       if (val instanceof Component) {
//         (children as unknown as Record<string, Component>)[key] = val;
//       } else {
//         (props as unknown as Record<string, unknown>)[key] = val;
//       }
//     }
//     return {
//       props: props as P,
//       children: children as Partial<C>,
//     };
//   }

//   protected compile(
//     template: string,
//     propsOverride?: Partial<P & { _id: string }>
//   ): DocumentFragment {
//     const context = { ...(propsOverride ?? this._props) } as Record<
//       string,
//       unknown
//     >;
//     for (const [key, child] of Object.entries(this._children)) {
//       context[key] = `<div data-id="${child._id}"></div>`;
//     }

//     const tpl = Handlebars.compile(template)(context);
//     const tplEl = document.createElement('template');
//     tplEl.innerHTML = tpl;

//     for (const child of Object.values(this._children)) {
//       const stub = tplEl.content.querySelector(`[data-id="${child._id}"]`);
//       stub?.replaceWith(child.getContent());
//     }

//     return tplEl.content;
//   }

//   private _componentDidMount(): void {
//     this.componentDidMount();
//     for (const child of Object.values(this._children)) {
//       child.dispatchComponentDidMount();
//     }
//   }
//   protected componentDidMount(): void {}

//   public dispatchComponentDidMount(): void {
//     this._eventBus.emit(Component.EVENTS.CDM);
//     if (Object.keys(this._children).length) {
//       this._eventBus.emit(Component.EVENTS.RENDER);
//     }
//   }

//   private _componentDidUpdate(
//     oldP: P & { _id: string },
//     newP: P & { _id: string }
//   ): void {
//     if (this.componentDidUpdate(oldP, newP)) {
//       this._eventBus.emit(Component.EVENTS.RENDER);
//     }
//   }
//   protected componentDidUpdate(
//     oldP: P & { _id: string },
//     newP: P & { _id: string }
//   ): boolean {
//     return deepEqual(oldP, newP);
//   }

//   public show(): void {
//     this.getContent().style.display = 'block';
//   }
//   public hide(): void {
//     this.getContent().style.display = 'none';
//   }
//   public getContent(): HTMLElement {
//     return this._element;
//   }

//   public setProps(nextProps: Partial<P>): void {
//     if (!nextProps) return;
//     this._setUpdate = false;
//     const old = { ...this._props };

//     const { props, children } = this.splitPropsAndChildren({
//       ...(nextProps as any),
//     });
//     Object.assign(this._props, props);
//     Object.assign(this._children, children as C);

//     if (this._setUpdate) {
//       this._eventBus.emit(Component.EVENTS.CDU, old, this._props);
//       this._setUpdate = false;
//     }
//   }

//   private createPropsProxy<T extends object>(props: T): T {
//     const self = this;

//     return new Proxy(props, {
//       get(target: T, p: string | symbol): unknown {
//         const prop = p as keyof T;
//         const value = target[prop];

//         return typeof value === 'function'
//           ? (value as Function).bind(target)
//           : value;
//       },

//       set(target: T, p: string | symbol, value: unknown): boolean {
//         const prop = p as keyof T;
//         if (target[prop] !== value) {
//           target[prop] = value as T[typeof prop];
//           self._setUpdate = true;
//         }
//         return true;
//       },
//     });
//   }

//   private createChildrenProxy<Ct extends object>(children: Ct): Ct {
//     const self = this;

//     return new Proxy(children, {
//       get(target: Ct, p: string | symbol): unknown {
//         const prop = p as keyof Ct;
//         return target[prop];
//       },

//       set(target: Ct, p: string | symbol, value: unknown): boolean {
//         const prop = p as keyof Ct;
//         target[prop] = value as Ct[typeof prop];
//         self._setUpdate = true;
//         return true;
//       },
//     });
//   }
// }
