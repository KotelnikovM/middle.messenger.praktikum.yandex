import { Component } from '../services/Component';

export default function render(query: string, component: Component) {
  const root = document.querySelector(query);

  if (root) root.appendChild(component.getContent());

  component.dispatchComponentDidMount();

  return root;
}
