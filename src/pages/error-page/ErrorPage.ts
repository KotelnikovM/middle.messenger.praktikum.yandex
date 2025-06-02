import { Button } from '../../components/button/button';
import { Typography } from '../../components/typography/Typography';
import { Component } from '../../services/component/Component';

const secondaryButton = `{{{button}}}`;
const heading = `{{{typographyHeading}}}`;
const paragraph = `{{{typographyParagraph}}}`;

export class ErrorPage extends Component {
  constructor({ type, text, ...props }: { [key: string]: string }) {
    super('main', {
      ...props,
      className: 'main',

      typographyHeading: new Typography({ tagName: 'h1', text: `${type}` }),
      typographyParagraph: new Typography({
        tagName: 'p',
        text: `${text}`,
      }),
      button: new Button({
        text: 'Назад к чатам',
        className: 'button-secondary',
        events: {
          click: (event: Event) => {
            event.preventDefault();
            window.history.back();
          },
        },
      }),
    });
  }

  render(): string {
    return `
        <section class='error'>
          ${heading}
          ${paragraph}
          ${secondaryButton}
        </section>
    `;
  }
}
