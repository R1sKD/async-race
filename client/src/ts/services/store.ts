import { getCars, getWinners } from '../api/api';
import { Store } from '../interfaces/interfaces';

const { items: cars, count: carsCount } = await getCars(1);
const { items: winners, count: winnersCount } = await getWinners(1);

const store: Store = {
  carsPage: 1,
  cars,
  carsCount,
  winnersPage: 1,
  winners,
  winnersCount,
  view: 'garage',
  sortType: '',
  sortOrder: '',
  animation: {}
};

export default store;