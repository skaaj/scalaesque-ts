abstract class Try<T> {
    static apply<T>(f: () => T): Try<T> {
        try {
            return Success.of(f())
        } catch(e) {
            return Failure.of(e)
        }
    }

    abstract get isFailure(): Boolean
    abstract get isSuccess(): Boolean
    abstract getOrElse<U>(defaultValue: U): T | U
    abstract orElse<U>(other: Try<U>): Try<T | U>
    abstract get get(): T
    abstract foreach<U>(f: (x: T) => U): void
    abstract flatMap<U>(f: (x: T) => Try<U>): Try<U>
    abstract map<U>(f: (x: T) => U): Try<U>
    abstract filter(p: (x: T) => Boolean): Try<T>
    abstract flatten<U>(): Try<T | U>
    abstract transform<U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U>
    abstract fold<U>(s: (x: T) => U, f: (t: Error) => U): U
}

class Success<T> extends Try<T> {
    constructor(private value: T) {
        super()
    }

    static of<T>(value: T): Success<T> {
        return new Success(value)
    }

    get isFailure(): Boolean {
        return false
    }

    get isSuccess(): Boolean {
        return true
    }

    getOrElse<U>(defaultValue: U): T | U {
        return this.value
    }

    orElse<U>(other: Try<U>): Try<T | U> {
        return this
    }

    get get(): T {
        return this.value
    }

    foreach<U>(f: (x: T) => U): void {
        f(this.value)
    }

    flatMap<U>(f: (x: T) => Try<U>): Try<U> {
        try {
            return f(this.value)
        } catch(e) {
            return Failure.of(e)
        }
    }

    map<U>(f: (x: T) => U): Try<U> {
        return Try.apply(() => f(this.value))
    }

    filter(p: (x: T) => Boolean): Try<T> {
        return p(this.value)
            ? this
            : Failure.of(new Error(`Predicate does not hold for ${this.value}`))
    }

    flatten<U>(): Try<T | U> {
        return this.value instanceof Try
            ? this.value
            : this
    }

    transform<U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U> {
        return s(this.value)
    }
    
    fold<U>(s: (x: T) => U, f: (t: Error) => U): U {
        return s(this.value)
    }
}

class Failure<T> extends Try<T> {
    constructor(private exception: Error) {
        super()
    }

    static of<T>(exception: Error): Failure<T> {
        return new Failure(exception)
    }

    get isFailure(): Boolean {
        return true
    }

    get isSuccess(): Boolean {
        return false
    }

    getOrElse<U>(defaultValue: U): T | U {
        return defaultValue
    }

    orElse<U>(other: Try<U>): Try<T | U> {
        return other
    }

    get get(): T {
        throw this.exception
    }

    foreach<U>(f: (x: T) => U): void {
        // empty side effect
    }

    flatMap<U>(f: (x: T) => Try<U>): Try<U> {
        return this.toInstanceOf<U>()
    }

    map<U>(f: (x: T) => U): Try<U> {
        return this.toInstanceOf<U>()
    }

    filter(p: (x: T) => Boolean): Try<T> {
        return this
    }

    flatten<U>(): Try<T | U> {
        return this.toInstanceOf<U>()
    }

    transform<U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U> {
        return f(this.exception)
    }
    
    fold<U>(s: (x: T) => U, f: (t: Error) => U): U {
        return f(this.exception)
    }

    private toInstanceOf<U>(): Try<U> {
        return Failure.of(this.exception)
    }
}

// TODO
// - toOption

const barney = {firstname: "Barney", lastname: "Doe"}
const louise = JSON.parse("{}")
console.log(Try.apply(() => barney.firstname));
console.log(Try.apply(() => louise.props.age));
