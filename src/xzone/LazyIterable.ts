export class LazySeq<T> implements Iterable<T> {
    private iterator: CachingIterator<T>;

    constructor(iterator: Iterator<T>) {
        this.iterator = new CachingIterator<T>(iterator);
    }

    [Symbol.iterator]() {
        return this.iterator.reset();
    }
}

class CachingIterator<T> implements Iterator<T> {
    private baseIterator: Iterator<T>;
    private isFirstPass: boolean;
    private cache: Array<T>;
    private current: number;

    constructor(baseIterator: Iterator<T>){
        this.baseIterator = baseIterator;
        this.isFirstPass = true;
        this.cache = [];
        this.current = 0;
    }

    reset() {
        this.current = 0;
        return this;
    }

    next() {
        if(this.isFirstPass && this.current >= this.cache.length) {
            return this.getFromBaseIterator();
        } else {
            return this.getFromCache();
        }
    }

    private getFromCache(): IteratorResult<T> {
        if(this.current >= this.cache.length) {
            return {
                value: undefined,
                done: true
            };
        } else {
            const index = this.current++;
            return {
                value: this.cache[index],
                done: false
            };
        }
    }

    private getFromBaseIterator(): IteratorResult<T> {
        const item = this.baseIterator.next();
        
        if(item.done) {
            this.isFirstPass = false;
        } else {
            this.cache.push(item.value);
        }

        this.current += 1;

        return item;
    }
}