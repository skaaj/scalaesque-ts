enum OptionType {
  Some = "__some",
  None = "__none"
}

interface Option<T> {
  type: OptionType;
  isEmpty: boolean;
  isDefined: boolean;
  get(): T | never;
  getOrElse<U>(defaultValue: U): T | U;
  map<U>(f: (x: T) => U): Option<U>;
  fold<U>(f: (x: T) => U, defaultValue: U): U;
  flatMap<U>(f: (x: T) => Option<U>): Option<U>;
  flatten(): Option<unknown> | never;
  filter(pred: (x: T) => Boolean): Option<T>;
  contains<U extends T>(elem: U): Boolean;
  exists(pred: (x: T) => Boolean): Boolean;
  forall(pred: (x: T) => Boolean): Boolean;
  foreach<U>(f: (x: T) => U): void;
  orElse<U>(defaultValue: Option<U>): Option<T | U>;
  zip<U>(that: Option<U>): Option<[T, U]> | None;
  unzip<U>(): [Option<T>, Option<U>];
  toArray<T>(): Array<T>;
}

function Option<T>(value: T): Option<T> {
  return value !== undefined && value !== null
    ? Some(value)
    : None();
}

Option.isNone = (obj: unknown): obj is None => {
  const type = (obj as None).type;
  return type !== undefined && type == OptionType.None;
}

Option.isSome = <T>(obj: unknown): obj is Some<T> => {
  const type = (obj as Some<T>).type;
  return type !== undefined && type == OptionType.Some;
}

Option.isOption = <T>(obj: unknown): obj is Option<T> => {
  return Option.isSome(obj) || Option.isNone(obj);
}

Option.sequence = <T>(...arr: Option<T>[]): Option<T[]> => {
  return arr.some(x => x.isEmpty)
    ? None()
    : Some(arr.map(x => x.get()));
}

interface Some<T> extends Option<T> {
  type: OptionType.Some;
  isEmpty: false;
  isDefined: true;
  get(): T;
  getOrElse<U>(defaultValue: U): T;
  orElse<U>(defaultValue: Option<U>): Option<T>;
}

const someImpl: Some<unknown> = {
  type: OptionType.Some,
  isDefined: true,
  isEmpty: false,
  get() {
    return this.value;
  },
  getOrElse<U>(defaultValue: U) {
    return this.value;
  },
  map<T, U>(f: (x: T) => U) {
    return Some(f(this.value));
  },
  fold<T, U>(f: (x: T) => U, defaultValue: U) {
    return f(this.value);
  },
  flatMap<T, U>(f: (x: T) => Option<U>) {
    return f(this.value);
  },
  flatten<U>() {
    const inner = this.value;
    if (Option.isOption(inner)) {
      return inner;
    } else {
      throw new Error("Could not flatten already flat Option.");
    }
  },
  filter<T>(pred: (x: T) => Boolean) {
    return pred(this.value) ? Some(this.value) : None();
  },
  contains<T, U extends T>(elem: U) {
    return this.value === elem;
  },
  exists<T>(pred: (x: T) => Boolean) {
    return pred(this.value);
  },
  forall<T>(pred: (x: T) => Boolean) {
    return pred(this.value);
  },
  foreach<T, U>(f: (x: T) => U) {
    f(this.value);
  },
  orElse<U>(defaultValue: Option<U>) {
    return this;
  },
  zip<T, U>(that: Option<U>) {
    return that.isDefined
      ? Some([this.value, that.get()] as [T, U])
      : None();
  },
  unzip<U>() {
    const inner = this.value;
    return inner instanceof Array && inner.length === 2
      ? [Some(inner[0]), Some(inner[1])]
      : [None(), None()];
  },
  toArray<T>(): Array<T> {
    return [this.value];
  }
};

function Some<T>(value: T): Some<T> {
  const obj = Object.create(someImpl);
  obj.value = value;
  return obj;
}

Object.setPrototypeOf(someImpl, Some.prototype);

interface None extends Option<never> {
  type: OptionType.None;
  isEmpty: true;
  isDefined: false;
  get(): never;
  getOrElse<U>(defaultValue: U): U;
  orElse<U>(defaultValue: Option<U>): Option<U>;
}

const noneImpl: None = {
  type: OptionType.None,
  isDefined: false,
  isEmpty: true,
  get() {
    throw new EvalError("None.get")
  },
  getOrElse<U>(defaultValue: U) {
    return defaultValue;
  },
  map<U>(f: (x: never) => U) {
    return None();
  },
  fold<U>(f: (x: never) => U, defaultValue: U) {
    return defaultValue;
  },
  flatMap<U>(f: (x: never) => Option<U>) {
    return None();
  },
  flatten<U>() {
    return None();
  },
  filter(pred: (x: never) => Boolean) {
    return None();
  },
  contains<U extends never>(elem: U) {
    return false;
  },
  exists(pred: (x: never) => Boolean) {
    return false;
  },
  forall(pred: (x: never) => Boolean) {
    return true;
  },
  foreach<U>(f: (x: never) => U) {
    /* nothing do to */
  },
  orElse<U>(defaultValue: Option<U>) {
    return defaultValue;
  },
  zip<U>(that: Option<U>) {
    return None();
  },
  unzip<U>() {
    return [None(), None()];
  },
  toArray<T>(): Array<T> {
    return [];
  }
}

function None(): None {
  return noneInstance;
}

const noneInstance: None = Object.create(noneImpl);

Object.setPrototypeOf(noneImpl, None.prototype);

export { Option, Some, None }