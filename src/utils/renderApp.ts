// import { Component } from '../services/Component';

export function renderApp(
  query: string,
  // component: Component
) {
  const root = document.querySelector(query);

  console.log(root);

  if (root) {
    root.innerHTML = '';
    // root.appendChild(component.getContent());
  }
}
