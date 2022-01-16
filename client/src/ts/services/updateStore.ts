import { getWinners, getCars } from "../api/api";
import store from "./store";

export const updateStateWinners = async (sort?: string, order?: string) => {
  const { items, count } = await getWinners(store.winnersPage, sort, order);
  store.winners = items;
  store.winnersCount = count;
};

export const updateStateCars = async () => {
  const { items, count } = await getCars(store.carsPage);
  store.cars = items;
  store.carsCount = count;
};