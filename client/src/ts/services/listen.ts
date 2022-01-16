import { listenMainPage } from '../pages/main-page/listen';
import { listenGaragePage } from '../pages/garage/listen';
import { listenWinnersPage } from '../pages/winners/listen';

const listen = () => {
  listenMainPage();
  listenGaragePage();
  listenWinnersPage();
};

export default listen;