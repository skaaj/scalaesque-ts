enum OptionType {
  Some = '__some',
  None = '__none',
}

export interface Option_WIP<T> {
  isEmpty: boolean,
  map<U>(f: (x: T) => U): Option_WIP<U>;
  flatMap<U>(f: (x: T) => Option_WIP<U>): Option_WIP<U>;
}

export interface Some_WIP<T> extends Option_WIP<T> {
  type: OptionType.Some;
  get(): T;
}

export interface None_WIP extends Option_WIP<never> {
  type: OptionType.None;
}

export const None_WIP = (): None_WIP => ({
  type: OptionType.None,
  isEmpty: true,
  map: <U>(f: (x: never) => U): Option_WIP<U> => None_WIP(),
  flatMap: <U>(f: (x: never) => Option_WIP<U>): Option_WIP<U> => None_WIP()
});

export const Some_WIP = <T>(value: T): Some_WIP<T> => ({
  type: OptionType.Some,
  isEmpty: false,
  get: () => value,
  flatMap: <U>(f: (x: T) => Option_WIP<U>): Option_WIP<U> => f(value),
  map: <U>(f: (x: T) => U): Option_WIP<U> => Some_WIP(f(value))
});
