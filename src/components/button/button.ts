import { Component } from '../../services/component/Component';

export class Button extends Component {
  constructor(props: object) {
    super('button', {
      ...props,
    });
  }

  render(): string {
    return `
        {{{text}}}
    `;
  }
}
