import { Component } from '../../services/component/Component';

// <input type={{type}} id={{id}} name={{name}} value={{value}} />

interface InputProps {
  type: string;
  id: string;
  name: string;
  value: string;
}

export class Input extends Component {
  constructor({ ...props }: InputProps) {
    super('input', {
      ...props,
    });
  }

  render(): string {
    return `
    {{{type}}}
    `;
  }
}
