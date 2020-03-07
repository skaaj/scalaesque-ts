class LazySeq<T> implements Iterable<T> {
    constructor(private iterable: () => Iterable<T>) {}
    
    [Symbol.iterator](): Iterator<T> {
        return this.iterable()[Symbol.iterator]()
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
        return new LazySeq<T>(function* () {
            yield item
        })
    }

    static empty(): LazySeq<null> {
        return new LazySeq<null>(function* () {})
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
        const iterable = this
        return new LazySeq<U>(function* () {
            for(const x of iterable) {
                yield f(x)
            }
        })
    }

    filter(p: (x: T) => Boolean): LazySeq<T> {
        const iterable = this
        return new LazySeq<T>(function* () {
            for(const x of iterable) {
                if(p(x)) {
                    yield x
                }
            }
        })
    }

    take(n: number): LazySeq<T> {
        if(n <= 0) {
            return LazySeq.empty()
        } else {
            const iterator = this[Symbol.iterator]()
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

    toArray(): Array<T> {
        return Array.from(this)
    }
}

const printSeq = xs => {
    for(let x of xs) {
        console.log(x);
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

LazySeq.of(1, 2, 3, 4, 5).map(x => { console.log(x); return x; }).take(10).toArray()

// console.log(LazySeq.of(1, 2, 3, 4, 50).map(x => {
//     console.log(x);
//     return x
// }).take(1).toArray());

// printSeq(LazySeq.of(1, 2, 3, 4, 50).take(3))
// printSeq(LazySeq.of(1, 2, 3, 4, 50).take(1))
