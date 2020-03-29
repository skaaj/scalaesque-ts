export interface Option<T> {
    isEmpty: boolean,
    isDefined: boolean,
    get(): T,
    getOrElse<U>(defaultValue: U): T | U,
    map<U>(f: (x: T) => U): Option<U>,
    fold<U>(f: (x: T) => U, defaultValue: U): U,
    flatMap<U>(f: (x: T) => Option<U>): Option<U>,
    flatten<U>(): Option<U> | T,
    filter(pred: (x: T) => Boolean): Option<T>,
    filterNot(pred: (x: T) => Boolean): Option<T>,
    contains<U extends T>(elem: U): Boolean,
    exists(pred: (x: T) => Boolean): Boolean,
    forall(pred: (x: T) => Boolean): Boolean,
    foreach<U>(f: (x: T) => U): void,
    orElse<U>(defaultValue: Option<U>): Option<T | U>,
    zip<U>(that: Option<U>): Option<[T, U]>,
    unzip<U>(): [Option<T>, Option<U>]
}

export type None = NoneObject;
class NoneObject implements Option<never> {
    private static instance: None;

    constructor() {}

    static unit(): None {
        if(!NoneObject.instance) {
            NoneObject.instance = new NoneObject;
        }
        return NoneObject.instance;
    }

    get isEmpty(): true {
        return true;
    }
    
    get isDefined(): false {
        return false;
    }

    get(): never {
        throw new EvalError("None.get");
    }

    getOrElse<U>(defaultValue: U): U {
        return defaultValue;
    }

    map<U>(f: (x: never) => U): None {
        return this;
    }

    fold<U>(f: (x: never) => U, defaultValue: U): U {
        return defaultValue;
    }

    flatMap<U>(f: (x: never) => Option<U>): None {
        return this;
    }

    flatten(): None {
        return this;
    }

    filter(pred: (x: never) => Boolean): Option<never> {
        return this;
    }

    filterNot(pred: (x: never) => Boolean): Option<never> {
        return this;
    }

    contains<U extends never>(elem: U): Boolean {
        return false;
    }
    
    exists(pred: (x: never) => Boolean): Boolean {
        return false;
    }

    forall(pred: (x: never) => Boolean): Boolean {
        return true;
    }
    
    foreach<U>(f: (x: never) => U): void {
        /* nothing do to */
    }
    
    orElse<U>(defaultValue: Option<U>): Option<U> {
        return defaultValue;
    }
    
    zip<U>(that: Option<U>): Option<never> {
        return NoneObject.unit();
    }
    
    unzip<U>(): [Option<never>, Option<never>] {
        return [NoneObject.unit(), NoneObject.unit()];
    }
}

export type Some<T> = SomeObject<T>;
class SomeObject<T> implements Option<T> {
    constructor(private value: T) {}
    
    get isDefined(): boolean {
        return true;
    }
    
    get isEmpty(): boolean {
        return false;
    }
    
    get(): T {
        return this.value;
    }
    
    getOrElse<U>(defaultValue: U): T {
        return this.value;
    }
    
    map<U>(f: (x: T) => U): Some<U> {
        return new SomeObject(f(this.value));
    }
    
    fold<U>(f: (x: T) => U, defaultValue: U): U {
        return f(this.value);
    }
    
    flatMap<U>(f: (x: T) => Option<U>): Option<U> {
        return f(this.value);
    }
    
    flatten<U>(): Option<U> | never {
        const inner = this.value;
        if(inner instanceof SomeObject || inner instanceof NoneObject) {
            return inner;
        } else {
            throw new Error("Could not flatten already flat Option.");
        }
    }
    
    filter(pred: (x: T) => Boolean): Option<T> {
        return pred(this.value) ? this : NoneObject.unit();
    }

    filterNot(pred: (x: T) => Boolean): Option<T> {
        return !pred(this.value) ? this : NoneObject.unit();
    }
    
    contains<U extends T>(elem: U): Boolean {
        return this.value === elem;
    }
    
    exists(pred: (x: T) => Boolean): Boolean {
        return pred(this.value);
    }
    
    forall(pred: (x: T) => Boolean): Boolean {
        return pred(this.value);
    }
    
    foreach<U>(f: (x: T) => U): void {
        f(this.value);
    }
    
    orElse<U>(defaultValue: Option<U>): Option<T> {
        return this;
    }
    
    zip<U>(that: Option<U>): Option<[T, U]> {
        return that.isDefined
            ? new SomeObject([this.value, that.get()] as [T, U])
            : NoneObject.unit();
    }
    
    unzip<U>(): [Option<T>, Option<U>] {
        const inner = this.value;
        return inner instanceof Array && inner.length === 2
            ? [new SomeObject(inner[0]), new SomeObject(inner[1])]
            : [NoneObject.unit(), NoneObject.unit()];
    }
}


Object.defineProperty(Some, Symbol.hasInstance, {
    value: (obj) => obj instanceof SomeObject
});

Object.defineProperty(None, Symbol.hasInstance, {
    value: (obj) => obj instanceof NoneObject
});

export function Some<T>(value: T): Some<T> {
    return new SomeObject(value);
}

export function None(): None {
    return NoneObject.unit();
}
