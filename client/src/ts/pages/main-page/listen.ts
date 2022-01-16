import { getGaragePage } from '../garage/garage';
import { getWinnersPage } from '../winners/winners';
import { PAGE_LIMIT_CARS, PAGE_LIMIT_WINNERS } from '../../api/api';
import store from '../../services/store';
import { showPage, hidePage } from '../../utils/utils';
import { updateStateWinners, updateStateCars } from '../../services/updateStore';
import { listenGaragePage } from '../garage/listen';

export const listenMainPage = (): void => {
  listenMenu();
  listenPagination();
};

const listenMenu = (): void => {
  (document.getElementById('menu') as HTMLDivElement).addEventListener('click', async (e: Event) => {
    if ((e.target as HTMLElement).id === 'to-garage') {
      hidePage('winners');
      showPage('garage');
      store.view = 'garage';
    } else if ((e.target as HTMLElement).id === 'to-winners') {
      hidePage('garage');
      showPage('winners');
      store.view = 'winners';
      await updateStateWinners(store.sortType, store.sortOrder);
      (document.getElementById('winners') as HTMLDivElement).innerHTML = getWinnersPage();
    }
    checkPagination();
  });
};

const listenPagination = (): void => {
  (document.getElementById('pagination') as HTMLDivElement).addEventListener('click', async (e: Event) => {
    if ((e.target as HTMLElement).id === 'prev' || (e.target as HTMLElement).id === 'next') {
      const operate = (e.target as HTMLElement).id === 'prev' ? '-' : '+';
      await changeStorePage(operate);
      if (store.view === 'garage') {
        await updateStateCars();
        await renderGaragePage();
        await listenGaragePage();
      } else if (store.view === 'winners') {
        await updateStateWinners(store.sortType, store.sortOrder);
        await renderWinnersPage();
      }
      checkPagination();
    }
  });
};

const changeStorePage = (operate: '+' | '-'): void => {
  const currentPage = store.view === 'garage' ? 'carsPage' : 'winnersPage';
  store[currentPage] = operate === '+' ? store[currentPage] + 1 : store[currentPage] - 1;
};

const renderGaragePage = (): void => {
  (document.getElementById('garage') as HTMLDivElement).innerHTML = getGaragePage();
};

const renderWinnersPage = (): void => {
  (document.getElementById('winners') as HTMLDivElement).innerHTML = getWinnersPage();
};

export const checkPagination = (): void => {
  const nextBtn = <HTMLButtonElement>document.getElementById('next');
  const prevBtn = <HTMLButtonElement>document.getElementById('prev');
  const currentPage = store.view === 'garage' ? 'carsPage' : 'winnersPage';
  const elemCount = currentPage === 'carsPage' ? 'carsCount' : 'winnersCount';
  const elemLimit = currentPage === 'carsPage' ? PAGE_LIMIT_CARS : PAGE_LIMIT_WINNERS;
  if (+store[elemCount] <= elemLimit) {
      nextBtn.disabled = true;
      prevBtn.disabled = true;
    } else if (store[currentPage] === 1) {
      nextBtn.disabled = false;
      prevBtn.disabled = true;
    } else if (store[currentPage] === Math.ceil(+store[elemCount] / elemLimit)) {
      nextBtn.disabled = true;
      prevBtn.disabled = false;
    } else {
      nextBtn.disabled = false;
      prevBtn.disabled = false;
    }
};