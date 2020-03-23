export abstract class Option<T> {
    static apply<T>(value: T) {
        return Some.of(value)
    }

    static empty() {
        return None.unit()
    }

    static when<T>(pred: Boolean, value: T): Option<T> {
        return pred ? Some.of(value) : None.unit()
    }

    static sequence<T>(...arr: Option<T>[]) {
        return arr.some(x => x.isEmpty)
            ? None.unit()
            : Some.of(arr.map(x => x.get))
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

    filter(pred: (x: T) => Boolean): Option<T> {
        return this.isEmpty || pred(this.get)
            ? this
            : None.unit()
    }

    filterNot(pred: (x: T) => Boolean): Option<T> {
        return this.isEmpty || !pred(this.get)
            ? this
            : None.unit()
    }

    contains<U extends T>(elem: U): Boolean {
        return !this.isEmpty && this.get === elem
    }

    exists(pred: (x: T) => Boolean): Boolean {
        return !this.isEmpty && pred(this.get)
    }

    forall(pred: (x: T) => Boolean): Boolean {
        return this.isEmpty || pred(this.get)
    }

    foreach<U>(f: (x: T) => U): void {
        if(!this.isEmpty) {
            f(this.get)
        }
    }

    orElse<U>(defaultValue: Option<U>): Option<T | U> {
        return this.isEmpty
            ? defaultValue
            : this
    }

    zip<U>(that: Option<U>): Option<[T, U]> {
        return this.isEmpty || that.isEmpty
            ? None.unit()
            : Some.of([this.get, that.get])
    }

    unzip<U>(): [Option<T>, Option<U>] {
        if(this.isEmpty || !(this.get instanceof Array)) {
            return [None.unit(), None.unit()]
        } else {
            const value = this.get
            return [Some.of(value[0]), Some.of(value[1])]
        }
    }

    toArray() {
        return this.isEmpty ? [] : [this.get]
    }
}

export class Some<T> extends Option<T> {
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

export class None extends Option<null> {
    constructor() {
        super()
    }

    static unit(): None {
        return new None()
    }

    get isEmpty(): Boolean {
        return true
    }

    get get(): never {
        throw new EvalError("None.get")
    }
}
