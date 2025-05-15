import { Component } from '../../services/Component';

export class Button extends Component {
  render(): string {
    return `
      <button class="button">
        <span class="button__text">
          <slot></slot>
        </span>
      </button>
    `;
  }
}
