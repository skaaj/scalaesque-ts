class LazySeq<T> implements Iterable<T> {
    constructor(private iterator: Iterator<T>) {}
    
    [Symbol.iterator]() {
        return this.iterator
    }

    static of<T>(...arr: Array<T>){
        return new LazySeq<T>(arr[Symbol.iterator]())
    }

    static from<T>(iterable: Iterable<T> | ArrayLike<T>): LazySeq<T> {
        return new LazySeq<T>(iterable[Symbol.iterator]())
    }
}

const xs = LazySeq.from(new Set([1, 1, 1, 2, 3]))
const ys = LazySeq.of(7, 8, 9)

for(let x of xs) {
    console.log(x);
}

for(let y of ys) {
    console.log(y);
}