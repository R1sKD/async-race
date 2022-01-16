import store from '../../services/store';
import { Car } from '../../interfaces/interfaces';
import { getCarImage } from '../garage/garage';
import { PAGE_LIMIT_WINNERS } from '../../api/api';

export const getWinnersPage = (): string => {
  const html = `
    <h1 class="title">Winners (${store.winnersCount})</h1>
    <h2 class="subtitle">Page #${store.winnersPage}</h2>
    <table class="winners-table">
      <thead>
        <tr>
          <th>Number</th>
          <th>Car</th>
          <th>Name</th>
          <th class="sort-btn sort-wins ${store.sortType === 'wins' ? store.sortOrder : ''}">Wins</th>
          <th class="sort-btn sort-time ${store.sortType === 'time' ? store.sortOrder : ''}">Best time (seconds)</th>
        </tr>
      </thead>
      <tbody>
        ${store.winners.map((winner, i) => `
          <tr>
            <td>${(i + 1) + (store.winnersPage - 1) * PAGE_LIMIT_WINNERS}</td>
            <td>${getCarImage((winner.car as Car).color)}</td>
            <td>${(winner.car as Car).name}</td>
            <td>${winner.wins}</td>
            <td>${winner.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  return html;
}