abstract class Option<T> {
  abstract isEmpty: boolean;
  abstract isDefined: boolean;
  abstract get(): T;
  abstract getOrElse<U>(defaultValue: U): T | U;
  abstract fold<U>(f: (x: T) => U, defaultValue: U): U;
  abstract map<U>(f: (x: T) => U): Option<U>;
  abstract flatMap<U>(f: (x: T) => Option<U>): Option<U>;
  abstract flatten<U>(): Option<U> | T;
  abstract filter(pred: (x: T) => Boolean): Option<T>;
  abstract filterNot(pred: (x: T) => Boolean): Option<T>;
  abstract contains<U extends T>(elem: U): Boolean;
  abstract exists(pred: (x: T) => Boolean): Boolean;
  abstract forall(pred: (x: T) => Boolean): Boolean;
  abstract foreach<U>(f: (x: T) => U): void;
  abstract orElse<U>(defaultValue: Option<U>): Option<T | U>;
  abstract zip<U>(that: Option<U>): Option<[T, U]>;
  abstract unzip<U>(): [Option<T>, Option<U>];
  static sequence<T>(...arr: Option<T>[]): Option<T[]> {
    return arr.some(x => x.isEmpty)
      ? None.unit()
      : new Some(arr.map(x => x.get()))
  }
}

class Some<T> extends Option<T> {
  constructor(private value: T) {
    super();
  }

  get isDefined(): boolean {
    return true;
  }

  get isEmpty(): boolean {
    return false;
  }

  get(): T {
    return this.value;
  }

  getOrElse<U>(defaultValue: U): T {
    return this.value;
  }

  map<U>(f: (x: T) => U): Some<U> {
    return new Some(f(this.value));
  }

  fold<U>(f: (x: T) => U, defaultValue: U): U {
    return f(this.value);
  }

  flatMap<U>(f: (x: T) => Option<U>): Option<U> {
    return f(this.value);
  }

  flatten<U>(): Option<U> | never {
    const inner = this.value;
    if (inner instanceof Some || inner instanceof None) {
      return inner;
    } else {
      throw new Error("Could not flatten already flat Option.");
    }
  }

  filter(pred: (x: T) => Boolean): Option<T> {
    return pred(this.value) ? this : None.unit();
  }

  filterNot(pred: (x: T) => Boolean): Option<T> {
    return !pred(this.value) ? this : None.unit();
  }

  contains<U extends T>(elem: U): Boolean {
    return this.value === elem;
  }

  exists(pred: (x: T) => Boolean): Boolean {
    return pred(this.value);
  }

  forall(pred: (x: T) => Boolean): Boolean {
    return pred(this.value);
  }

  foreach<U>(f: (x: T) => U): void {
    f(this.value);
  }

  orElse<U>(defaultValue: Option<U>): Option<T> {
    return this;
  }

  zip<U>(that: Option<U>): Option<[T, U]> {
    return that.isDefined
      ? new Some([this.value, that.get()] as [T, U])
      : None.unit();
  }

  unzip<U>(): [Option<T>, Option<U>] {
    const inner = this.value;
    return inner instanceof Array && inner.length === 2
      ? [new Some(inner[0]), new Some(inner[1])]
      : [None.unit(), None.unit()];
  }
}

class None extends Option<never> {
  private static instance: None;

  private constructor() {
    super();
  }

  static unit(): None {
    if (!None.instance) {
      None.instance = new None;
    }
    return None.instance;
  }

  get isEmpty(): true {
    return true;
  }

  get isDefined(): false {
    return false;
  }

  get(): never {
    throw new EvalError("None.get");
  }

  getOrElse<U>(defaultValue: U): U {
    return defaultValue;
  }

  map<U>(f: (x: never) => U): None {
    return this;
  }

  fold<U>(f: (x: never) => U, defaultValue: U): U {
    return defaultValue;
  }

  flatMap<U>(f: (x: never) => Option<U>): Option<U> {
    return this;
  }

  flatten(): None {
    return this;
  }

  filter(pred: (x: never) => Boolean): Option<never> {
    return this;
  }

  filterNot(pred: (x: never) => Boolean): Option<never> {
    return this;
  }

  contains<U extends never>(elem: U): Boolean {
    return false;
  }

  exists(pred: (x: never) => Boolean): Boolean {
    return false;
  }

  forall(pred: (x: never) => Boolean): Boolean {
    return true;
  }

  foreach<U>(f: (x: never) => U): void {
    /* nothing do to */
  }

  orElse<U>(defaultValue: Option<U>): Option<U> {
    return defaultValue;
  }

  zip<U>(that: Option<U>): Option<never> {
    return None.unit();
  }

  unzip<U>(): [Option<never>, Option<never>] {
    return [None.unit(), None.unit()];
  }
}

function SomeFactory<T>(value: T): Some<T> {
  return new Some(value);
}

function NoneFactory(): Option<never> {
  return None.unit();
}

Object.defineProperty(SomeFactory, Symbol.hasInstance, {
  value: (obj) => obj instanceof Some
});

Object.defineProperty(NoneFactory, Symbol.hasInstance, {
  value: (obj) => obj instanceof None
});

export {
  Option,
  Option as OptionType,
  Some as SomeType,
  None as NoneType,
  SomeFactory as Some,
  NoneFactory as None
};
