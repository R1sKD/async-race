import store from "../../services/store";
import { updateStateWinners } from "../../services/updateStore";
import { getWinnersPage } from "./winners";

export const listenWinnersPage = () => {
  (document.getElementById('winners') as HTMLDivElement).addEventListener('click', async (e: Event) => {

    if ((e.target as HTMLElement).classList.contains('sort-wins')) {
      store.sortType = 'wins';
      store.sortOrder = store.sortOrder !== 'DESC' ? 'DESC' : 'ASC';
      await updateStateWinners(store.sortType, store.sortOrder);
      (document.getElementById('winners') as HTMLDivElement).innerHTML = getWinnersPage();
    }

    if ((e.target as HTMLElement).classList.contains('sort-time')) {
      store.sortType = 'time';
      store.sortOrder = store.sortOrder !== 'DESC' ? 'DESC' : 'ASC';
      await updateStateWinners(store.sortType, store.sortOrder);
      (document.getElementById('winners') as HTMLDivElement).innerHTML = getWinnersPage();
    }
    
  });
};