import { Component } from '../../services/component/Component';

export class FormInput extends Component {
  constructor({ ...props }: { [key: string]: string }) {
    super('div', {
      ...props,
      className: 'form-group',
    });
  }

  render(): string {
    return `
      <label for={{name}}>{{label}}</label>
      <input type={{type}} id={{id}} name={{name}} value={{value}} />
    `;
  }
}
