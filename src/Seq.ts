import { Option, Some, None } from './Option'

export class Seq<T> implements Iterable<T> {
    private constructor(private iterableProvider: () => Iterable<T>) {}
    
    [Symbol.iterator](): Iterator<T, T> {
        return this.iterableProvider()[Symbol.iterator]()
    }

    private get iterable(): Iterable<T> {
        return this.iterableProvider()
    }

    private get iterator(): Iterator<T, T> {
        return this[Symbol.iterator]()
    }

    get head(): T {
        const result = this.iterator.next()
        if(result.done) {
            throw new Error("head of empty sequence")
        } else {
            return result.value
        }
    }

    get headOption(): Option<T> {
        const result = this.iterator.next()
        return result.done ? None.unit() : Some.of(result.value)
    }

    get tail(): Seq<T> {
        return this.drop(1)
    }

    static of<T>(...arr: Array<T>){
        return new Seq<T>(() => arr)
    }

    static from<T>(iterable: Iterable<T>): Seq<T> {
        return new Seq<T>(() => iterable)
    }

    static create<T>(generator: () => Generator<T>): Seq<T> {
        return new Seq<T>(generator)
    }
    
    static empty(): Seq<null> {
        return new Seq<null>(() => [])
    }
    
    static range(start: number, end: number) {
        return new Seq<number>(function* () {
            let i = start
            while(i < end) {
                yield i
                i += 1
            }
        })
    }

    map<U>(f: (x: T) => U): Seq<U> {
        const iterable = this.iterable
        return new Seq<U>(function* () {
            for(const x of iterable) {
                yield f(x)
            }
        })
    }

    foreach<U>(f: (x: T) => U): void {
        for(const x of this.iterable) {
            f(x)
        }
    }

    flatMap<U>(f: (x: T) => Seq<U>): Seq<U> {
        const iterable = this.iterable
        return new Seq<U>(function* () {
            for(const x of iterable) {
                yield* f(x)
            }
        })
    }

    filter(p: (x: T) => boolean): Seq<T> {
        const iterable = this.iterable
        return new Seq<T>(function* () {
            for(const x of iterable) {
                if(p(x)) {
                    yield x
                }
            }
        })
    }

    concat(other: Iterable<T>): Seq<T> {
        const iterable = this.iterable;
        return new Seq<T>(function* () {
            yield* iterable;
            yield* other;
        });
    }

    append(x: T): Seq<T> {
        const iterable = this.iterable
        return new Seq<T>(function* () {
            yield* iterable;
            yield x;
        });
    }

    prepend(x: T): Seq<T> {
        const iterable = this.iterable
        return new Seq<T>(function* () {
            yield x;
            yield* iterable;
        });
    }

    take(n: number): Seq<T> {
        if(n <= 0) {
            return Seq.empty()
        } else {
            const iterator = this.iterator
            return new Seq<T>(function* () {
                let i = 0
                let current = iterator.next()
                while(!current.done) {
                    yield current.value

                    i += 1
                    current = i < n
                        ? iterator.next()
                        : { done: true, value: null }
                }
            })
        }
    }

    drop(n: number): Seq<T> {
        if(n <= 0) {
            return new Seq(this.iterableProvider)
        } else {
            const iterable = this.iterable
            return new Seq(function* () {
                let count = 0
                for(const x of iterable) {
                    count += 1
                    if(count > n) {
                        yield x
                    }
                }
            })
        }
    }

    dropWhile(p: (x: T) => boolean): Seq<T> {
        const iterator = this.iterator;
        return Seq.create(function* () {
            let current = iterator.next();
            let started = false;
            while(!current.done) {
                if(!started) {
                    started = !p(current.value);
                }
                if(started) {
                    yield current.value;
                }
                current = iterator.next();
            }
        });
    }
 
    zip<U>(other: Iterable<U>): Seq<[T, U]> {
        const iteratorLeft = this.iterator
        const iteratorRight = other[Symbol.iterator]()

        let left = iteratorLeft.next()
        let right = iteratorRight.next()

        return new Seq<[T, U]>(function* () {
            while(!left.done && !right.done) {
                yield [left.value, right.value]
                left = iteratorLeft.next()
                right = iteratorRight.next()
            }
        })
    }

    contains(value: T): boolean {
        for(const x of this.iterable) {
            if(x === value) {
                return true;
            }
        }
        return false;
    }

    exists(p: (x: T) => boolean): boolean {
        for(const x of this.iterable) {
            if(p(x)) {
                return true
            }
        }
        return false
    }

    forall(p: (x: T) => boolean): boolean {
        return !this.exists(x => !p(x))
    }

    count(p: (x: T) => boolean): number {
        let count = 0
        for(const x of this) {
            if(p(x)) {
                count += 1
            }
        }
        return count
    }

    toArray(): Array<T> {
        return Array.from(this.iterable)
    }
}