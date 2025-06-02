import { Component } from '../services/component/Component';

export function renderApp(query: string, component: Component) {
  const root = document.querySelector<HTMLElement>(query);
  root?.append(component.getContent() as Node);

  console.log(root);

  return root;
}
