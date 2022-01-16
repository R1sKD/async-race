import { getGaragePage } from '../garage/garage';
import { getWinnersPage } from '../winners/winners';
import { checkPagination } from './listen';

export const renderHTML = (): void => {
  const html = `
    <div class="menu" id="menu">
      <button class="button button--green" id="to-garage">to garage</button>
      <button class="button button--green" id="to-winners">to winners</button>
    </div>
    <div class="garage" id="garage">
      ${getGaragePage()}
    </div>
    <div class="winners" id="winners" style="display: none">
      ${getWinnersPage()}
    </div>
    <div class="pagination" id="pagination">
      <button class="button" id="prev" disabled>prev</button>
      <button class="button" id="next" disabled>next</button>
    </div>
  `;
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
  checkPagination();
};