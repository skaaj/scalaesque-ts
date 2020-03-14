class Seq<T> implements Iterable<T> {
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
    
    static just<T>(item: T) {
        return new Seq<T>(() => [item])
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

    flatMap<U>(f: (x: T) => Seq<U>): Seq<U> {
        const iterable = this.iterable
        return new Seq<U>(function* () {
            for(const x of iterable) {
                yield* f(x)
            }
        })
    }

    filter(p: (x: T) => Boolean): Seq<T> {
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
        const iterable = this.iterable
        return new Seq<T>(function* () {
            yield* iterable;
            yield* other;
        })
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

    forall(p: (x: T) => Boolean): Boolean {
        return !this.exists(x => !p(x))
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

const xs = Seq.of(1, 2, 3).zip(['a', 'b']).toArray()
console.log(xs);
console.log(Seq.of(25).exists(x => x > 50));
console.log(Seq.of(1337).head);
console.log(Seq.of(1, 2, 3, 4, 5).tail.toArray());
console.log(Seq.empty().toArray());
const [head, ...tail] = Seq.of(1, 2, 3, 4, 5);
console.log(head);
console.log(tail);
console.log(Seq.of(1, 2, 3).forall(x => x > 0));

// console.log(LazySeq.of(1, 2, 3, 4, 50).map(x => {
//     console.log(x);
//     return x
// }).take(1).toArray());

// printSeq(LazySeq.of(1, 2, 3, 4, 50).take(3))
// printSeq(LazySeq.of(1, 2, 3, 4, 50).take(1))
