enum TryType {
    Success = "__success",
    Failure = "__failure"
}

interface Try<T> {
    type: TryType,
    isFailure(): Boolean,
    isSuccess(): Boolean,
    getOrElse<U>(defaultValue: U): T | U,
    orElse<U>(other: Try<U>): Try<T | U>,
    get(): T,
    foreach<U>(f: (x: T) => U): void,
    flatMap<U>(f: (x: T) => Try<U>): Try<U>,
    map<U>(f: (x: T) => U): Try<U>,
    filter(p: (x: T) => Boolean): Try<T>,
    flatten<U>(): Try<T | U>,
    transform<U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U>,
    fold<U>(s: (x: T) => U, f: (t: Error) => U): U
}

function Try<T>(f: () => T): Try<T> {
    try {
        return Success(f())
    } catch (e) {
        return Failure(e)
    }
}

interface Success<T> extends Try<T> {
    type: TryType.Success
}

function Success<T>(value: T): Success<T> {
    const obj = Object.create(failureImpl);
    obj.value = value;
    return obj;
}

const successImpl: Success<unknown> = {
    type: TryType.Success,
    isFailure(): Boolean {
        return false
    },
    isSuccess(): Boolean {
        return true
    },
    getOrElse<T, U>(defaultValue: U): T | U {
        return this.value
    },
    orElse<T, U>(other: Try<U>): Try<T | U> {
        return this
    },
    get<T>(): T {
        return this.value
    },
    foreach<T, U>(f: (x: T) => U): void {
        f(this.value)
    },
    flatMap<T, U>(f: (x: T) => Try<U>): Try<U> {
        try {
            return f(this.value)
        } catch(e) {
            return Failure(e)
        }
    },
    map<T, U>(f: (x: T) => U): Try<U> {
        return Try.apply(() => f(this.value))
    },
    filter<T>(p: (x: T) => Boolean): Try<T> {
        return p(this.value)
            ? this
            : Failure(new Error(`Predicate does not hold for ${this.value}`))
    },
    flatten<T, U>(): Try<T | U> {
        return this.value instanceof Try
            ? this.value
            : this
    },
    transform<T, U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U> {
        return s(this.value)
    },
    fold<T, U>(s: (x: T) => U, f: (t: Error) => U): U {
        return s(this.value)
    }
}

Object.setPrototypeOf(successImpl, Success.prototype);

interface Failure<T> extends Try<T> {
    type: TryType.Failure
}

function Failure<T extends Error>(error: T): Failure<T> {
    const obj = Object.create(failureImpl);
    obj.error = error;
    return obj;
}

const failureImpl: Failure<unknown> = {
    type: TryType.Failure,
    isFailure(): Boolean {
        return true
    },
    isSuccess(): Boolean {
        return false
    },
    getOrElse<T, U>(defaultValue: U): T | U {
        return defaultValue
    },
    orElse<T, U>(other: Try<U>): Try<T | U> {
        return other
    },
    get<T>(): never {
        throw this.error
    },
    foreach<T, U>(f: (x: T) => U): void {
        // empty side effect
    },
    flatMap<T, U>(f: (x: T) => Try<U>): Try<U> {
        return this
    },
    map<T, U>(f: (x: T) => U): Try<U> {
        return this
    },
    filter<T>(p: (x: T) => Boolean): Try<T> {
        return this
    },
    flatten<T, U>(): Try<T | U> {
        return this
    },
    transform<T, U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U> {
        return f(this.error)
    },
    fold<T, U>(s: (x: T) => U, f: (t: Error) => U): U {
        return f(this.error)
    }
}

Object.setPrototypeOf(failureImpl, Failure.prototype)

export { Try, Success, Failure }