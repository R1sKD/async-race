import { createCar, deleteCar, deleteWinner, updateCar } from "../../api/api";
import { updateStateCars, updateStateWinners } from "../../services/updateStore";
import { checkPagination } from '../main-page/listen';
import store from '../../services/store';
import { getGarageView } from "./garage";
import { Car } from "../../interfaces/interfaces";
import { getRandomNum, getRandomColor } from "../../utils/utils";
import { cars } from "../../services/models";
import { listenRace } from "./race";

export const listenGaragePage = (): void => {
  listenCreateCar();
  listenRemoveCar();
  listenGenerateCars();
  listenRace();
};

const listenCreateCar = (): void => {
  (document.getElementById('create-car') as HTMLButtonElement).addEventListener('click', async () => {
    await handleCreateCar();
    checkPagination();
  });
};

const listenRemoveCar = (): void => {
  (document.getElementById('garage-view') as HTMLDivElement).addEventListener('click', async (e: Event) => {
    const el = <HTMLElement>e.target;
    if (el.classList.contains('button-remove')) {
      await handleRemoveCar(el);
      checkPagination();
    }
    if (el.classList.contains('button-select')) {
      await selectCar(el);
    }
  });
};

const listenGenerateCars = (): void => {
  (document.getElementById('generate-cars') as HTMLButtonElement).addEventListener('click', async (e: Event) => {
    await generateCars(e);
    checkPagination();
  });
};

const renderGarageView = () => (document.getElementById('garage-view') as HTMLUListElement).innerHTML = getGarageView();

const handleCreateCar = async (): Promise<void> => {
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const color = (document.getElementById('color') as HTMLInputElement).value;
  await createCar({ name, color });
  await updateStateCars();
  await renderGarageView();
};

const handleRemoveCar = async (el: HTMLElement): Promise<void> => {
  const carId = +(el.closest('.garage__item') as HTMLLIElement).id;
  await deleteCar(carId);
  await handleDeleteWinner(carId);
  await updateStateCars();
  await checkCarsPage();
  await renderGarageView();
};

const handleDeleteWinner = async (carId: number): Promise<void> => {
  if (store.winners.find(({ id }) => id === carId)) {
    await deleteWinner(carId);
    await updateStateWinners();
  }
};

const checkCarsPage = async () => {
  if (store.cars.length === 0 && store.carsPage > 1) {
    store.carsPage -= 1;
    await updateStateCars();
  }
};

const selectCar = (el: HTMLElement): void => {
  const carItem = <HTMLLIElement>el.closest('.garage__item');
  const name = <HTMLInputElement>document.getElementById('update-car-name');
  const color = <HTMLInputElement>document.getElementById('update-car-color');
  const updateCarBtn = <HTMLButtonElement>document.getElementById('update-car');
  const removeCarBtn = <HTMLButtonElement>carItem.querySelector('.button-remove');
  const car = <Car>store.cars.find(({ id }) => id === +carItem.id);
  activateUpdateForm(name, color, updateCarBtn, car);
  removeCarBtn.disabled = true;
  updateCarBtn.onclick = async (e: Event): Promise<void> => {
    e.preventDefault();
    await updateCar((car.id as number), { name: name.value, color: color.value });
    await updateStateCars();
    await renderGarageView();
    deactivateUpdateForm(name, color, updateCarBtn);
    removeCarBtn.disabled = false;
    checkPagination();
  };
};

const activateUpdateForm = (
  name: HTMLInputElement,
  color: HTMLInputElement,
  updateCarBtn: HTMLButtonElement,
  car: Car
): void => {
  name.disabled = false;
  name.focus();
  name.value = car.name;
  color.disabled = false;
  color.value = car.color;
  updateCarBtn.disabled = false;
}

const deactivateUpdateForm = (
  name: HTMLInputElement,
  color: HTMLInputElement,
  updateCarBtn: HTMLButtonElement,
): void => {
  name.disabled = true;
  name.value = '';
  color.disabled = true;
  color.value = '#ffffff';
  updateCarBtn.disabled = true;
}

const GENERATED_CARS = 100;
const generateCars = async (e: Event): Promise<void> => {
  (e.target as HTMLButtonElement).disabled = true;
  const cars = generateRandomCars(GENERATED_CARS);
  Promise.all(cars.map((car) => createCar(car)));
  await updateStateCars();
  await renderGarageView();
  (e.target as HTMLButtonElement).disabled = false;
};

const generateRandomCars = (countCars: number): Car[] => {
  const cars = [];
  for (let i = 0; i < countCars; i++) {
    cars.push(getRandomCar());
  }
  return cars;
};

const getRandomCar = (): Car => {
  const name = getRandomCarName();
  const color = `#${getRandomColor()}`;
  return { name, color };
};

export const getRandomCarName = (): string => {
  const keys: string[] = Object.keys(cars);
  const brand: string = keys[getRandomNum(keys.length)];
  const models: string[] = cars[brand as keyof typeof cars];
  const model: string = models[getRandomNum(models.length)];
  return `${brand} ${model}`;
};