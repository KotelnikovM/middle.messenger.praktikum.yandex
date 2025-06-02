import { ButtonGroup } from './components/button-group/ButtonGroup';
import { FormInput } from './components/form-input/FormInput';
import { Form } from './components/form/Form';
import { Input } from './components/input/Input';
import { ErrorPage } from './pages/error-page/ErrorPage';
import { LoginPage } from './pages/login/Login';
import { renderApp } from './utils/renderApp';

const test = document.getElementById('test');

// const error404Page = new ErrorPage({ type: '404', text: 'Не туда попали' });
const error500Page = new ErrorPage({ type: '500', text: 'Мы уже фиксим' });
const buttonGroup = new ButtonGroup({
  primaryText: 'Первый',
  secondaryText: 'Второй',
});
const form = new Form({
  primaryText: 'Авторизоваться',
  secondaryText: 'Нет аккаунта?',
});

const formInput = new FormInput({
  name: 'email',
  label: 'Почта',
  type: 'email',
  id: 'email',
  value: 'pochta@yandex.ru',
});

const input = new Input({
  type: 'email',
  id: 'email',
  name: 'email',
  value: 'pochta@yandex.ru',
});

const loginPage = new LoginPage({});

if (test) {
  renderApp('#test', loginPage);
}
