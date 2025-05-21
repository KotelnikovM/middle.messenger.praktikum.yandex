import { Button } from './components/button/button';
import { renderApp } from './utils/renderApp';

const test = document.getElementById('app');

if (test) {
  renderApp('#app', new Button());
}
