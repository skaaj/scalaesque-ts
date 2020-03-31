class Some<T> {
  constructor(private value: T) {}

  map<U>(f: (x: T) => U): Some<U> {
    return new Some(f(this.value));
  }
}

function SomeConstructor<T>(value: T) {
  return new Some(value);
}

export { SomeConstructor as Some };
