import { Button } from '../../components/button/button';
import { FormInput } from '../../components/form-input/FormInput';
import { Form } from '../../components/form/Form';
import { Typography } from '../../components/typography/Typography';
import { Component } from '../../services/component/Component';

const inputsList = [
  {
    label: 'Логин',
    name: 'login',
    value: '',

    type: 'text',
    // required: true,
    // pattern: `(?=.*[a-z]|[A-Z])[a-zA-Z0-9\\-_]{3,20}`,
    // minlength: 3,
    // maxlength: 20,
  },
  {
    label: 'Пароль',
    name: 'password',
    value: '',
    type: 'password',
    // required: true,
    // pattern: `((?=.*\\d)(?=.*[A-Z]).{8,40})`,
    // minlength: 8,
    // maxlength: 40,
  },
];

export class LoginPage extends Component {
  constructor({ type, text, ...props }: { [key: string]: string }) {
    super('main', {
      ...props,
      className: 'main',

      loginForm: new Form({
        primaryText: 'Войти',
        secondaryText: 'Нет аккаунта?',
        inputsList: inputsList,
      }),

      // button: new Button({
      //   text: 'Назад к чатам',
      //   className: 'button-secondary',
      //   events: {
      //     click: (event: Event) => {
      //       event.preventDefault();
      //       window.history.back();
      //     },
      //   },
      // }),
    });
  }

  render(): string {
    return `
        {{{loginForm}}}
    `;
  }
}
