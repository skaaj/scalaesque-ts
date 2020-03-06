class LazySeq<T> implements Iterable<T> {
    constructor(private iterator: () => Iterator<T>) {}
    
    [Symbol.iterator](): Iterator<T> {
        return this.iterator()
    }

    static of<T>(...arr: Array<T>){
        return new LazySeq<T>(() => arr[Symbol.iterator]())
    }

    static from<T>(iterable: Iterable<T>): LazySeq<T> {
        return new LazySeq<T>(() => iterable[Symbol.iterator]())
    }

    toArray(): Array<T> {
        return Array.from(this)
    }
}

const xs = LazySeq.from(new Set([1, 1, 1, 2, 3, 4]));
const ys = xs.toArray();

for(let y of ys) {
    console.log(y);
}

for(let y of ys) {
    console.log(y);
}