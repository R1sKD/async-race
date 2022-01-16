import { createWinner, drive, getWinner, startEngine, stopEngine, updateWinner } from "../../api/api";
import store from "../../services/store";
import { getDistanceBetweenElements, animation, disablePagination } from "../../utils/utils";
import { checkPagination } from "../main-page/listen";

export const listenRace = () => {
  (document.getElementById('garage') as HTMLUListElement).onclick = async (e: Event) => {

    if ((e.target as HTMLElement).classList.contains('garage__car-button--start')) {
      const carBox = (e.target as HTMLButtonElement).closest('.garage__item') as HTMLLIElement;
      await startDriving(carBox);
    }

    if ((e.target as HTMLElement).classList.contains('garage__car-button--stop')) {
      const carBox = (e.target as HTMLButtonElement).closest('.garage__item') as HTMLLIElement;
      await stopDriving(carBox);
    }

    if ((e.target as HTMLElement).classList.contains('button-race')) {
      (document.querySelector('.button-reset') as HTMLButtonElement).disabled = false;
      handleControlButtons(true);
      await disablePagination();
      const winner = await race();
      await handleWinner(winner);
      checkPagination();
    }

    if ((e.target as HTMLElement).classList.contains('button-reset')) {
      (e.target as HTMLButtonElement).disabled = true;
      await resetCars();
      hideWinner();
      handleControlButtons(false);
      checkPagination();
    }
  };
};

const resetCars = async () => {
  await Promise.all(store.cars.map((car) => stopDriving(<HTMLLIElement>document.getElementById(`${car.id}`))));
}

const startDriving = async (carBox: HTMLLIElement) => {
  const id = +carBox.id;
  const startButton = <HTMLButtonElement>carBox.querySelector('.garage__car-button--start');
  const stopButton = <HTMLButtonElement>carBox.querySelector('.garage__car-button--stop');
  startButton.disabled = true;

  const { velocity, distance } = await startEngine(id);
  const time = Math.round(distance / velocity);

  stopButton.disabled = false;

  const car = <HTMLSpanElement>carBox.querySelector('.garage__car');
  const flag = <HTMLDivElement>carBox.querySelector('.flag');
  const htmlDistance = Math.floor(getDistanceBetweenElements(car, flag)) + 160;

  store.animation[id] = animation(car, htmlDistance, time);

  const { success } = await drive(id);

  if (!success) {
    window.cancelAnimationFrame(store.animation[id].id)
  }

  return { success, id, time };
};

const stopDriving = async (carBox: HTMLLIElement) => {
  const id = +carBox.id;
  const startButton = <HTMLButtonElement>carBox.querySelector('.garage__car-button--start');
  const stopButton = <HTMLButtonElement>carBox.querySelector('.garage__car-button--stop');
  stopButton.disabled = true;
  await stopEngine(id);
  window.cancelAnimationFrame(store.animation[id].id);
  const car = <HTMLSpanElement>carBox.querySelector('.garage__car');
  car.style.transform = 'translateX(0)';
  startButton.disabled = false;
};

const race = async (): Promise<{ name: string; id: number; color: string; time: number; }> => {
  const promises = store.cars.map((car) => startDriving(<HTMLLIElement>document.getElementById(`${car.id}`)));
  const winner = await raceAll(promises, <number[]>store.cars.map((car) => car.id));

  return winner;
};

const handleControlButtons = (mode: boolean) => {
  (document.getElementById('create-car') as HTMLButtonElement).disabled = mode;
  (document.getElementById('race') as HTMLButtonElement).disabled = mode;
  (document.getElementById('generate-cars') as HTMLButtonElement).disabled = mode;
  Array.from((document.getElementsByClassName('button-select') as HTMLCollectionOf<HTMLButtonElement>))
    .forEach((button) => button.disabled = mode);
  Array.from((document.getElementsByClassName('button-remove') as HTMLCollectionOf<HTMLButtonElement>))
    .forEach((button) => button.disabled = mode);
};

const raceAll = async (
  promises: Promise<{
    success: boolean;
    id: number;
    time: number;
  }>[],
  ids: number[]
): Promise<{ name: string; color: string; id: number; time: number; }> => {
  const { success, id, time } = await Promise.race(promises);

  if (!success) {
    const faliedIndex = ids.findIndex((i: number) => i === id);
    const restPromises = [...promises.slice(0, faliedIndex), ...promises.slice(faliedIndex + 1, promises.length)];
    const restIds = [...ids.slice(0, faliedIndex), ...ids.slice(faliedIndex + 1, ids.length)];
    return raceAll(restPromises, restIds);
  }

  const car = <{ name: string; color: string; id: number; }>store.cars.find((car) => car.id === id);
  return { ...car, time: +(time / 1000).toFixed(2) };
};

const handleWinner = async (newWinner: { name: string; color: string; id: number; time: number; }) => {
  const winner = await getWinner(newWinner.id);

  if (winner.id) {
    const winsCount = winner.wins + 1;
    await updateWinner(newWinner.id, { id: newWinner.id, wins: winsCount, time: newWinner.time });
  } else {
    await createWinner({ id: newWinner.id, wins: 1, time: newWinner.time });
  }

  showWinner(newWinner);
};

const showWinner = (winner: { name: string; color: string; id: number; time: number; }) => {
  const winnerBox = document.createElement('div');
  winnerBox.id = 'winner-box';
  winnerBox.innerHTML = `${winner.name} is first (${winner.time}s)`;
  (document.getElementById('garage') as HTMLDivElement).appendChild(winnerBox);
};

const hideWinner = () => {
  if ((document.getElementById('winner-box') as HTMLDivElement)) {
    (document.getElementById('garage') as HTMLDivElement).
      removeChild((document.getElementById('winner-box') as HTMLDivElement));
  }
};