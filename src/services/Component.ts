import { deepEqual } from '../utils/deepEqual';
import { ObjectI } from '../utils/types';
import { EventBus } from './EventBus';

export class Component {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  _element?: HTMLElement;
  _meta: { tagName: string; props: unknown };
  eventBus: () => EventBus<{ [x: string]: unknown }>;
  props: object;

  constructor(tagName = 'div', props = {}) {
    const eventBus = new EventBus();

    this._meta = {
      tagName,
      props,
    };

    this.eventBus = () => eventBus;
    this.props = this._makePropsProxy(props);
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  init() {
    this._createResources();
    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
  }

  componentDidMount(oldProps?: unknown) {}

  dispatchComponentDidMount(): void {
    this.eventBus().emit(Component.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: ObjectI, newProps: Object) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: Object, newProps: Object): boolean {
    return deepEqual(oldProps, newProps);
  }

  //Сначала нужно реализовать методы  _componentDidUpdate, _render,
  // _registerEvents(eventBus: ) {
  //   eventBus.
  // }

  _makePropsProxy(props: { [key: string]: unknown }) {
    const self = this;

    return new Proxy(props, {
      get(target, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },

      set(target, prop: string, value) {
        target[prop] = value;

        self.eventBus().emit(Component.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },

      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _render() {
    const block = this.render();
    // Этот небезопасный метод для упрощения логики
    // Используйте шаблонизатор из npm или напишите свой безопасный
    // Нужно не в строку компилировать (или делать это правильно),
    // либо сразу в DOM-элементы возвращать из compile DOM-ноду
    this._element.innerHTML = block;
  }
  render() {}

  _createDocumentElement(tagName: string) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }
}
