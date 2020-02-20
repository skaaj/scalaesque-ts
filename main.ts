abstract class Option<T> {
    abstract get(): T
    abstract contains(item: T): Boolean
    abstract exists(p: (_: T) => Boolean): Boolean
    abstract filter(p: (_: T) => Boolean): Option<T>
    abstract filterNot(p: (_: T) => Boolean): Option<T>
    abstract flatten(): Option<T>
    abstract fold<U>(f: (_: T) => U, ifEmpty: U): U

    abstract map<U>(f: (_: T) => U): Option<U>
    abstract flatMap<U>(f: (_: T) => Option<U>): Option<U>
}

class Some<T> extends Option<T> {
    constructor(private value: T) {
        super()
    }

    static from<T>(value: T) {
        return new Some(value)
    }

    flatMap<U>(f: (_: T) => Option<U>): Option<U> {
        return f(this.value)
    }

    map<U>(f: (_: T) => U): Option<U> {
        return new Some(f(this.value))
    }

    filter(p: (_: T) => Boolean): Option<T> {
        return p(this.value) ? new Some(this.value) : new None()
    }

    filterNot(p: (_: T) => Boolean): Option<T> {
        return !p(this.value) ? new Some(this.value) : new None()
    }

    flatten(): Option<T> {
        if(this.value instanceof Some) {
            return new Some(this.value.value)
        } else {
            return new None()
        }
    }

    exists(p: (_: T) => Boolean): Boolean {
        return p(this.value)
    }

    fold<U>(f: (_: T) => U, _: U): U {
        return f(this.value)
    }

    contains(item: T): Boolean {
        return this.value === item
    }

    get(): T {
        return this.value
    }
}

class None<T> extends Option<T> {
    static unit<T>() {
        return new None<T>()
    }
    
    flatMap<U>(_: (_: T) => Option<U>): Option<U> {
        return new None()
    }

    map<U>(_: (_: T) => U): Option<U> {
        return new None()
    }

    filter(_: (_: T) => Boolean): Option<T> {
        return new None()
    }

    filterNot(p: (_: T) => Boolean): Option<T> {
        return new None()
    }

    contains(_: T): Boolean {
        return false
    }

    exists(p: (_: T) => Boolean): Boolean {
        return false
    }

    fold<U>(_: (_: T) => U, ifEmpty: U): U {
        return ifEmpty
    }

    flatten(): Option<T> {
        return new None()
    }

    get(): T {
        throw new Error("No such element")
    }
}

const foo = Some.from(1337)
    .map(x => x * 10)
    .flatMap(_ => None.unit())
    .map(x => x.toString())

const bar = Some.from(42)
    .map(x => x * 10)
    .filter(x => x > 400)
    .get()

console.log(foo)
console.log(bar)
console.log(Some.from(3).contains(3))
console.log(Some.from(3).contains(4))
console.log(None.unit().contains(4))
console.log(Some.from(20).exists(x => x > 10))
console.log(None.unit().exists(x => x > 10))
console.log(Some.from(None.unit()).flatten())
console.log(Some.from(1992).fold(x => x + 28, 12020))
console.log(None.unit<number>().fold(x => x + 28, 12020))

