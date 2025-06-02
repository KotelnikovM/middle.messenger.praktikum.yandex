import { Component } from '../../services/component/Component';
import { ButtonGroup } from '../button-group/ButtonGroup';
import { FormInput } from '../form-input/FormInput';

export class Form extends Component {
  constructor({
    primaryText,
    secondaryText,
    inputsList,
    ...props
  }: {
    [key: string]: any;
  }) {
    super('form', {
      ...props,
      className: 'auth-container',

      inputsList: inputsList?.map((item: any) => ({
        input: new FormInput(item),
      })),

      buttonGroup: new ButtonGroup({
        primaryText: primaryText,
        secondaryText: secondaryText,
      }),
    });
  }

  render(): string {
    return `
          {{{inputsList}}}
          {{{buttonGroup}}}
    `;
  }
}
