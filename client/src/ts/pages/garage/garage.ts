import store from '../../services/store';
import { Car } from '../../interfaces/interfaces';

export const getGaragePage = (): string => {
  const html = `
    <div class="garage__forms">
      <form class="garage__form">
        <input class="garage__form-input" type="text" id="name">
        <input class="garage__form-input" type="color" id="color" value="#ffffff">
        <button class="button" id="create-car" type="button">create</button>
      </form>
      <form class="garage__form">
        <input class="garage__form-input" id="update-car-name" type="text" disabled>
        <input class="garage__form-input" id="update-car-color" type="color" disabled value="#ffffff">
        <button class="button" id="update-car" disabled>update</button>
      </form>
    </div>
    <div class="garage__controls">
      <button class="button button--green button-race" id="race">race</button>
      <button class="button button--green button-reset" disabled>reset</button>
      <button class="button" id="generate-cars">generate cars</button>
    </div>
    <div class="garage__view" id="garage-view">
      ${getGarageView()}
    </div>
  `;
  return html;
}

export const getGarageView = (): string => {
  const html = `
    <h1 class="title" id="garage-count"> Garage (${store.carsCount})</h1>
    <h2 class="subtitle" id ="garage-page">Page #${store.carsPage}</h2>
    <ul class="garage__list" id="cars">
      ${getCarsHtml()}
    </ul>
  `;
  return html;
}

export const getCarsHtml = (): string => store.cars.map((car) => getCarHtml(car)).join('');

export const getCarHtml = (car: Car): string => {
  const html = `
    <li class="garage__item" id="${car.id}">
      <div class="garage__item-top">
        <button class="button button-select">select</button>
        <button class="button button-remove">remove</button>
        <span class="garage__car-name">${car.name}</span>
      </div>
      <div class="garage__item-main">
        <button class="garage__car-button garage__car-button--start">A</button>
        <button class="garage__car-button garage__car-button--stop" disabled>B</button>
        <span class="garage__car">
          ${getCarImage(car.color)}
        </span>
      </div>
      <div class="flag">
        ${getFinishImage()}
      </div>
    </li>
  `;
  return html;
}

export const getCarImage = (color: string): string => {
  const html = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      <path fill="${color}"
        d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48z">
      </path>
    </svg>
  `;
  return html;
}

const getFinishImage = (): string => {
  const html = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="#fff"
        d="M243.2 189.9V258c26.1 5.9 49.3 15.6 73.6 22.3v-68.2c-26-5.8-49.4-15.5-73.6-22.2zm223.3-123c-34.3 15.9-76.5 31.9-117 31.9C296 98.8 251.7 64 184.3 64c-25 0-47.3 4.4-68 12 2.8-7.3 4.1-15.2 3.6-23.6C118.1 24 94.8 1.2 66.3 0 34.3-1.3 8 24.3 8 56c0 19 9.5 35.8 24 45.9V488c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24v-94.4c28.3-12.1 63.6-22.1 114.4-22.1 53.6 0 97.8 34.8 165.2 34.8 48.2 0 86.7-16.3 122.5-40.9 8.7-6 13.8-15.8 13.8-26.4V95.9c.1-23.3-24.2-38.8-45.4-29zM169.6 325.5c-25.8 2.7-50 8.2-73.6 16.6v-70.5c26.2-9.3 47.5-15 73.6-17.4zM464 191c-23.6 9.8-46.3 19.5-73.6 23.9V286c24.8-3.4 51.4-11.8 73.6-26v70.5c-25.1 16.1-48.5 24.7-73.6 27.1V286c-27 3.7-47.9 1.5-73.6-5.6v67.4c-23.9-7.4-47.3-16.7-73.6-21.3V258c-19.7-4.4-40.8-6.8-73.6-3.8v-70c-22.4 3.1-44.6 10.2-73.6 20.9v-70.5c33.2-12.2 50.1-19.8 73.6-22v71.6c27-3.7 48.4-1.3 73.6 5.7v-67.4c23.7 7.4 47.2 16.7 73.6 21.3v68.4c23.7 5.3 47.6 6.9 73.6 2.7V143c27-4.8 52.3-13.6 73.6-22.5z">
      </path>
    </svg>
  `;
  return html;
}