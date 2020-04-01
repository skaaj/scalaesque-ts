interface Option<T> {

}

class Some<T> implements Option<T> {
  constructor(private value: T) {}

  map<U>(f: (x: T) => U): Some<U> {
    return new Some(f(this.value));
  }
}

function SomeConstructor<T>(value: T) {
  return new Some(value);
}

SomeConstructor.sayHello = (): void => {
  console.log("hello");
}

class None implements Option<never> {
  private static instance: None;

    private constructor() {}

    static unit(): None {
        if(!None.instance) {
            None.instance = new None;
        }
        return None.instance;
    }
}

function NoneConstructor() {
  return None.unit();
}

Object.defineProperty(SomeConstructor, Symbol.hasInstance, {
  value: (obj) => obj instanceof Some
});

export { SomeConstructor as Some, NoneConstructor as None };
