import { Component } from '../../services/component/Component';
import { Button } from '../button/button';

const primaryButton = `{{{primaryButton}}}`;
const secondaryButton = `{{{secondaryButton}}}`;

export class ButtonGroup extends Component {
  constructor({
    primaryText,
    secondaryText,
    ...props
  }: {
    [key: string]: string;
  }) {
    super('div', {
      ...props,
      className: 'button-group',

      primaryButton: new Button({
        text: primaryText,
        className: 'button-primary',
        events: {
          click: (event: Event) => {
            console.log(event);
          },
        },
      }),

      secondaryButton: new Button({
        text: secondaryText,
        className: 'button-secondary',
        events: {
          click: (event: Event) => {
            console.log(event);
          },
        },
      }),
    });
  }

  render(): string {
    return `
          ${primaryButton}
          ${secondaryButton}
    `;
  }
}
