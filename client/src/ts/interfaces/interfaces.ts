export type Car = {
  name: string;
  color: string;
  id?: number;
};

export type Cars = {
  items: Car[] | [];
  count: string;
};

export type EngineMode = {
  velocity: number;
  distance: number;
}

export type DriveMode = {
  success: boolean;
}

export type Winners = {
  items: Winner[] | [];
  count: string;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
  car?: Car;
};

export type Sort = string | undefined;

export type Order = string | undefined;

export interface AnimationState {
  id: number;
}

export interface Animation {
  [key: string]: AnimationState
}

export type Store = {
  carsPage: number;
  cars: Car[];
  carsCount: string,
  winnersPage: number;
  winners: Winner[];
  winnersCount: string;
  view: string;
  sortType: string;
  sortOrder: string;
  animation: Animation
}