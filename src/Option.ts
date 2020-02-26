abstract class Option<T> {
    static apply<T>(value: T) {
        return Some.of(value)
    }

    static empty() {
        return None.unit()
    }

    static when<T>(pred: Boolean, value: T): Option<T> {
        return pred ? Some.of(value) : None.unit()
    }

    abstract get isEmpty(): Boolean
    
    get isDefined() {
        return !this.isEmpty
    }

    abstract get get(): T
    
    getOrElse<U>(defaultValue: U): T | U {
        return this.isEmpty ? defaultValue : this.get
    }

    get orNull(): T | null {
        return this.getOrElse(null)
    }

    map<U>(f: (x: T) => U): Option<U> {
        return this.isEmpty
            ? None.unit()
            : Some.of(f(this.get))
    }

    fold<U>(f: (x: T) => U, defaultValue: U): U {
        return this.isEmpty
            ? defaultValue
            : f(this.get)
    }

    flatMap<U>(f: (x: T) => Option<U>): Option<U> {
        return this.isEmpty
            ? None.unit()
            : f(this.get)
    }

    flatten<U>(): Option<U> {
        return this.isDefined && this.get instanceof Option
            ? this.get
            : None.unit()
    }
}

class Some<T> extends Option<T> {
    constructor(private value: T) {
        super()
    }

    static of<T>(value: T): Option<T> {
        return value == null
            ? new None()
            : new Some(value)
    }

    get isEmpty() {
        return false
    }

    get get(): T {
        return this.value
    }
}

class None extends Option<null> {
    constructor() {
        super()
    }

    static unit(): None {
        return new None()
    }

    get isEmpty() {
        return true
    }

    get get(): never {
        throw new EvalError("None.get")
    }
}

console.log("-- Creation");
console.log(Option.apply("10"))
console.log(Option.apply(undefined))
console.log(Option.empty())
console.log(Option.when(1 === 1, 10))
console.log(Some.of(1337))
console.log(Some.of(null))
console.log("-- Status");
console.log(None.unit().isEmpty)
console.log(Some.of(0).isEmpty)
console.log(None.unit().isDefined)
console.log(Some.of(0).isDefined)
console.log("-- Access")
try { None.unit().get } catch(e) { console.log(e) }
console.log(Some.of(0).get)
console.log(Some.of(0).getOrElse(100))
console.log(None.unit().getOrElse(100))
console.log(Some.of(0).orNull)
console.log(None.unit().orNull)
console.log(Some.of(0).fold(x => x + 1, -1))
console.log(Some.of(null).fold(x => x + 1, -1))
console.log("-- Flatmap and Map")
console.log(Some.of(0).map(x => x + 1))
console.log(Some.of(null).map(x => x + 1))
console.log(Some.of(0).flatMap(x => Some.of(x + 1)))
console.log(Some.of(null).flatMap(x => Some.of(x + 1)))
console.log("-- Flatten")
console.log(Some.of(Some.of(12)).flatten())
console.log(Some.of(12).flatten())
console.log(Some.of(None).flatten())
console.log(Some.of(Some.of(Some.of(12))).flatten())
console.log();
console.log();
console.log(Some.of(Some.of(12)).flatMap(x => x));



