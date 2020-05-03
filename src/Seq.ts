import { Option, Some, None } from './Option'

interface Seq<T> extends Iterable<T> {
    head(): T;
    headOption(): Option<T>;
    tail(): Seq<T>;
    map<U>(f: (x: T) => U): Seq<U>;
    foreach<U>(f: (x: T) => U): void;
    flatMap<U>(f: (x: T) => Seq<U>): Seq<U>;
    filter(p: (x: T) => boolean): Seq<T>;
    concat(other: Iterable<T>): Seq<T>;
    append(x: T): Seq<T>;
    prepend(x: T): Seq<T>;
    take(n: number): Seq<T>;
    drop(n: number): Seq<T>;
    dropWhile(p: (x: T) => boolean): Seq<T>;
    zip<U>(other: Iterable<U>): Seq<[T, U]>;
    contains(value: T): boolean;
    exists(p: (x: T) => boolean): boolean;
    forall(p: (x: T) => boolean): boolean;
    count(p: (x: T) => boolean): number;
    toArray(): Array<T>;
}

const seqImpl = {
    [Symbol.iterator]<T>(): Iterator<T, T> {
        return this.iterableProvider()[Symbol.iterator]()
    },

    foo: 12,

    iterable<T>(): Iterable<T> {
        return this.iterableProvider()
    },

    iterator<T>(): Iterator<T, T> {
        return this[Symbol.iterator]()
    },

    head<T>(): T {
        const result = this.iterator().next()
        if (result.done) {
            throw new Error("head of empty sequence")
        } else {
            return result.value
        }
    },
    
    headOption<T>(): Option<T> {
        const result = this.iterator().next()
        return result.done ? None() : Some(result.value)
    },
    
    tail<T>(): Seq<T> {
        return this.drop(1)
    },
    
    map<T, U>(f: (x: T) => U): Seq<U> {
        const iterable = this.iterable()
        return Seq.create<U>(function* () {
            for (const x of iterable) {
                yield f(x)
            }
        })
    },
    
    foreach<T, U>(f: (x: T) => U): void {
        for (const x of this.iterable()) {
            f(x)
        }
    },
    
    flatMap<T, U>(f: (x: T) => Seq<U>): Seq<U> {
        const iterable = this.iterable()
        return Seq.create(function* () {
            for (const x of iterable) {
                yield* f(x)
            }
        })
    },
    
    filter<T>(p: (x: T) => boolean): Seq<T> {
        const iterable = this.iterable()
        return Seq.create(function* () {
            for (const x of iterable) {
                if (p(x)) {
                    yield x
                }
            }
        })
    },
    
    concat<T>(other: Iterable<T>): Seq<T> {
        const iterable = this.iterable();
        return Seq.create(function* () {
            yield* iterable;
            yield* other;
        });
    },
    
    append<T>(x: T): Seq<T> {
        const iterable = this.iterable()
        return Seq.create(function* () {
            yield* iterable;
            yield x;
        });
    },
    
    prepend<T>(x: T): Seq<T> {
        const iterable = this.iterable()
        return Seq.create(function* () {
            yield x;
            yield* iterable;
        });
    },
    
    take<T>(n: number): Seq<T> {
        if (n <= 0) {
            return Seq.empty()
        } else {
            const iterator = this.iterator()
            return Seq.create(function* () {
                let i = 0
                let current = iterator.next()
                while (!current.done) {
                    yield current.value

                    i += 1
                    current = i < n
                        ? iterator.next()
                        : { done: true, value: null }
                }
            })
        }
    },
    
    drop<T>(n: number): Seq<T> {
        if (n <= 0) {
            return Seq.create(this.iterableProvider)
        } else {
            const iterable = this.iterable()
            return Seq.create(function* () {
                let count = 0
                for (const x of iterable) {
                    count += 1
                    if (count > n) {
                        yield x
                    }
                }
            })
        }
    },
    
    dropWhile<T>(p: (x: T) => boolean): Seq<T> {
        const iterator = this.iterator();
        return Seq.create(function* () {
            let current = iterator.next();
            let started = false;
            while (!current.done) {
                if (!started) {
                    started = !p(current.value);
                }
                if (started) {
                    yield current.value;
                }
                current = iterator.next();
            }
        });
    },
    
    zip<T, U>(other: Iterable<U>): Seq<[T, U]> {
        const iteratorLeft = this.iterator()
        const iteratorRight = other[Symbol.iterator]()

        let left = iteratorLeft.next()
        let right = iteratorRight.next()

        return Seq.create<[T, U]>(function* () {
            while (!left.done && !right.done) {
                yield [left.value, right.value]
                left = iteratorLeft.next()
                right = iteratorRight.next()
            }
        })
    },
    
    contains<T>(value: T): boolean {
        for (const x of this.iterable) {
            if (x === value) {
                return true;
            }
        }
        return false;
    },
    
    exists<T>(p: (x: T) => boolean): boolean {
        for (const x of this.iterable) {
            if (p(x)) {
                return true
            }
        }
        return false
    },
    
    forall<T>(p: (x: T) => boolean): boolean {
        return !this.exists(x => !p(x))
    },
    
    count<T>(p: (x: T) => boolean): number {
        let count = 0
        for (const x of this) {
            if (p(x)) {
                count += 1
            }
        }
        return count
    },
    
    toArray<T>(): Array<T> {
        return Array.from(this.iterable())
    }
}

function Seq<T>(...arr: Array<T>): Seq<T> {
    return Seq.create(() => arr);
}

Seq.create = <T>(provider: () => Iterable<T>): Seq<T> => {
    const obj = Object.create(seqImpl);
    obj.iterableProvider = provider;
    return obj;
}

Seq.empty = <T>(): Seq<T> => Seq.create<T>(() => [])
Seq.from = <T>(iterable: Iterable<T>): Seq<T> => Seq.create(() => iterable)
Seq.range = (start: number, end: number): Seq<number> => {
    return Seq.create(function* () {
        let i = start
        while(i < end) {
            yield i
            i += 1
        }
    })
}

Object.setPrototypeOf(seqImpl, Seq.prototype);

export { Seq }