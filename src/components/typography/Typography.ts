import { Component } from '../../services/component/Component';

interface TypographyProps {
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  text: string;
}
export class Typography extends Component {
  constructor(props: TypographyProps) {
    super(props.tagName, {
      ...props,
    });
  }

  render(): string {
    return `
        {{{text}}}
    `;
  }
}
