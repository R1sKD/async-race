import { Car, Cars, EngineMode, DriveMode, Winners, Sort, Order, Winner } from "../interfaces/interfaces";

const base = 'http://127.0.0.1:3000';

const garage = `${base}/garage`;
const winners = `${base}/winners`;
const engine = `${base}/engine`;

export const PAGE_LIMIT_CARS = 7;
export const PAGE_LIMIT_WINNERS = 10;

export const getCars = async (page: number, limit: number = PAGE_LIMIT_CARS): Promise<Cars> => {
  try {
    const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);

    return {
      items: await response.json(),
      count: <string>response.headers.get('X-Total-Count')
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const getCar = async (id: number): Promise<Car> => {
  try {
    const response = await fetch(`${garage}/${id}`);
    const car = await response.json();
    return car;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const createCar = async (body: Car): Promise<Car> => {
  try {
    const response = (await fetch(garage, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const deleteCar = async (id: number): Promise<Car> => {
  try {
    const response = (await fetch(`${garage}/${id}`, {
      method: 'DELETE'
    })).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const updateCar = async (id: number, body: Car): Promise<Car> => {
  try {
    const response = (await fetch(`${garage}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const startEngine = async (id: number): Promise<EngineMode> => {
  try {
    const response = (
      await fetch(`${engine}?id=${id}&status=started`, { method: 'PATCH' })
    ).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const stopEngine = async (id: number): Promise<EngineMode> => (
  await fetch(`${engine}?id=${id}&status=stopped`, { method: 'PATCH' })
).json();

export const drive = async (id: number): Promise<DriveMode> => {
  try {
    const response = await fetch(`${engine}?id=${id}&status=drive`, { method: 'PATCH' });
    return response.status !== 200 ? { success: false } : { ...await response.json() };
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

const getSortOrder = (sort: Sort | undefined, order: Order | undefined): string => {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;
  return '';
};

export const getWinners = async (
  page: number,
  sort?: Sort,
  order?: Order,
  limit: number = PAGE_LIMIT_WINNERS
): Promise<Winners> => {
  try {
    const response: Response = await fetch(`${winners}?_page=${page}&_limit=${limit}${getSortOrder(sort, order)}`);
    const winnersArr: Winner[] = await response.json();

    return {
      items: await Promise.all(winnersArr.map(async winner => ({ ...winner, car: await getCar(winner.id) }))),
      count: <string>response.headers.get('X-Total-Count')
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const getWinner = async (id: number): Promise<Winner> => {
  try {
    const response = await fetch(`${winners}/${id}`);
    return await response.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const createWinner = async (body: Winner): Promise<Winner> => {
  try {
    const response = ((await fetch(winners, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }))).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const deleteWinner = async (id: number): Promise<Winner> => {
  try {
    const response = ((await fetch(`${winners}/${id}`,
      { method: 'DELETE' }
    ))).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const updateWinner = async (id: number, body: Winner): Promise<Winner> => {
  try {
    const response = (await fetch(`${winners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })).json();
    return response;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};