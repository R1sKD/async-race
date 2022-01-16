import './scss/main.scss';
import { renderHTML } from './ts/pages/main-page/main-page';
import './ts/services/store';
import listen from './ts/services/listen';

renderHTML();
listen();