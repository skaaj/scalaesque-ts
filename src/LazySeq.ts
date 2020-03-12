class LazySeq<T> implements Iterable<T> {
    constructor(private iterableProvider: () => Iterable<T>) {}
    
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

    get tail(): LazySeq<T> {
        return this.drop(1)
    }

    static of<T>(...arr: Array<T>){
        return new LazySeq<T>(() => arr)
    }

    static from<T>(iterable: Iterable<T>): LazySeq<T> {
        return new LazySeq<T>(() => iterable)
    }

    static create<T>(generator: () => Generator<T>): LazySeq<T> {
        return new LazySeq<T>(generator)
    }
    
    static just<T>(item: T) {
        return new LazySeq<T>(() => [item])
    }

    static empty(): LazySeq<null> {
        return new LazySeq<null>(() => [])
    }

    static range(start: number, end: number) {
        return new LazySeq<number>(function* () {
            let i = start
            while(i < end) {
                yield i
                i += 1
            }
        })
    }

    map<U>(f: (x: T) => U): LazySeq<U> {
        const iterable = this.iterable
        return new LazySeq<U>(function* () {
            for(const x of iterable) {
                yield f(x)
            }
        })
    }

    flatMap<U>(f: (x: T) => LazySeq<U>): LazySeq<U> {
        const iterable = this.iterable
        return new LazySeq<U>(function* () {
            for(const x of iterable) {
                yield* f(x)
            }
        })
    }

    filter(p: (x: T) => Boolean): LazySeq<T> {
        const iterable = this.iterable
        return new LazySeq<T>(function* () {
            for(const x of iterable) {
                if(p(x)) {
                    yield x
                }
            }
        })
    }

    concat(other: Iterable<T>): LazySeq<T> {
        const iterable = this.iterable
        return new LazySeq<T>(function* () {
            yield* iterable;
            yield* other;
        })
    }

    take(n: number): LazySeq<T> {
        if(n <= 0) {
            return LazySeq.empty()
        } else {
            const iterator = this.iterator
            return new LazySeq<T>(function* () {
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

    drop(n: number): LazySeq<T> {
        if(n <= 0) {
            return new LazySeq(this.iterableProvider)
        } else {
            const iterable = this.iterable
            return new LazySeq(function* () {
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
 
    zip<U>(other: Iterable<U>): LazySeq<[T, U]> {
        const iteratorLeft = this.iterator
        const iteratorRight = other[Symbol.iterator]()

        let left = iteratorLeft.next()
        let right = iteratorRight.next()

        return new LazySeq<[T, U]>(function* () {
            while(!left.done && !right.done) {
                yield [left.value, right.value]
                left = iteratorLeft.next()
                right = iteratorRight.next()
            }
        })
    }

    contains(value: T): Boolean {
        for(const x of this.iterable) {
            if(x === value) {
                return true;
            }
        }
        return false;
    }

    exists(p: (x: T) => Boolean): Boolean {
        for(const x of this.iterable) {
            if(p(x)) {
                return true
            }
        }
        return false
    }

    count(p: (x: T) => Boolean): number {
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

// const xs = LazySeq.from(new Set([1, 1, 1, 2, 3, 4]));
// const ys = xs.toArray();

// printSeq(xs)
// printSeq(ys)
// printSeq(LazySeq.create(function* () {
//     yield 10
//     yield 20
//     yield 30
//     yield 40
// }))
// printSeq(LazySeq.just(42))
// printSeq(LazySeq.range(0, 4))
// printSeq(LazySeq.empty())
// printSeq(LazySeq.of(1, 2, 3, 4, 50).map(x => x).filter(x => x > 10).take(0))

// LazySeq.of(1, 2, 3, 4, 5).map(x => { console.log(x); return x; }).take(10).toArray()

const xs = LazySeq.of(1, 2, 3).zip(['a', 'b']).toArray()
console.log(xs);
console.log(LazySeq.of(25).exists(x => x > 50));
console.log(LazySeq.of(1337).head);
console.log(LazySeq.of(1, 2, 3, 4, 5).tail.toArray());
console.log(LazySeq.empty().toArray());
const [head, ...tail] = LazySeq.of(1, 2, 3, 4, 5);
console.log(head);
console.log(tail);




// console.log(LazySeq.of(1, 2, 3, 4, 50).map(x => {
//     console.log(x);
//     return x
// }).take(1).toArray());

// printSeq(LazySeq.of(1, 2, 3, 4, 50).take(3))
// printSeq(LazySeq.of(1, 2, 3, 4, 50).take(1))
