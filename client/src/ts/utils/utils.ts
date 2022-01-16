import { AnimationState } from '../interfaces/interfaces';

export const hidePage = (id: string): void => {
  (document.getElementById(id) as HTMLElement).style.display = 'none';
}

export const showPage = (id: string): void => {
  (document.getElementById(id) as HTMLElement).style.display = 'block';
}

export const getRandomNum = (count: number): number => {
  return Math.floor(Math.random() * count);
};

export const getRandomColor = (): string => Math.floor(Math.random() * 16777215).toString(16);

export const getDistanceBetweenElements = (el1: HTMLElement, el2: HTMLElement): number => {
  const startFirstElem = el1.offsetLeft + el1.offsetWidth;
  const startSecondElem = el2.offsetLeft;
  return startSecondElem - startFirstElem;
};

export const animation = (car: HTMLElement, distance: number, animationTime: number) => {
  let start: number | null = null;
  const state: AnimationState = {
    id: 1
  };

  function step(timestamp: number) {
    if (!start) start = timestamp;
    const time = timestamp - (start as number);
    const passed = Math.round(time * (distance / animationTime));

    car.style.transform = `translateX(${Math.min(passed, distance)}px)`;

    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }

  state.id = window.requestAnimationFrame(step);
  
  return state;
};

export const disablePagination = () => {
  (document.getElementById('prev') as HTMLButtonElement).disabled = true;
  (document.getElementById('next') as HTMLButtonElement).disabled = true;
};