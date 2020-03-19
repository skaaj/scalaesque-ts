export abstract class Option<T> {
    static apply<T>(value: T) {
        return Some.of(value)
    }

    static empty() {
        return None.unit()
    }

    static when<T>(pred: Boolean, value: T): Option<T> {
        return pred ? Some.of(value) : None.unit()
    }

    static sequence<T>(...arr: Option<T>[]) {
        return arr.some(x => x.isEmpty)
            ? None.unit()
            : Some.of(arr.map(x => x.get))
    }

    abstract get isEmpty(): Boolean
    
    get isDefined() {
        return !this.isEmpty
    }

    abstract get get(): T
    
    getOrElse<U>(defaultValue: U): T | U {
        return this.isEmpty ? defaultValue : this.get
    }

    get orNull(): T | null {
        return this.getOrElse(null)
    }

    map<U>(f: (x: T) => U): Option<U> {
        return this.isEmpty
            ? None.unit()
            : Some.of(f(this.get))
    }

    fold<U>(f: (x: T) => U, defaultValue: U): U {
        return this.isEmpty
            ? defaultValue
            : f(this.get)
    }

    flatMap<U>(f: (x: T) => Option<U>): Option<U> {
        return this.isEmpty
            ? None.unit()
            : f(this.get)
    }

    flatten<U>(): Option<U> {
        return this.isDefined && this.get instanceof Option
            ? this.get
            : None.unit()
    }

    filter(pred: (x: T) => Boolean): Option<T> {
        return this.isEmpty || pred(this.get)
            ? this
            : None.unit()
    }

    filterNot(pred: (x: T) => Boolean): Option<T> {
        return this.isEmpty || !pred(this.get)
            ? this
            : None.unit()
    }

    contains<U extends T>(elem: U): Boolean {
        return !this.isEmpty && this.get === elem
    }

    exists(pred: (x: T) => Boolean): Boolean {
        return !this.isEmpty && pred(this.get)
    }

    forall(pred: (x: T) => Boolean): Boolean {
        return this.isEmpty || pred(this.get)
    }

    foreach<U>(f: (x: T) => U): void {
        if(!this.isEmpty) {
            f(this.get)
        }
    }

    orElse<U>(defaultValue: Option<U>): Option<T | U> {
        return this.isEmpty
            ? defaultValue
            : this
    }

    zip<U>(that: Option<U>): Option<[T, U]> {
        return this.isEmpty || that.isEmpty
            ? None.unit()
            : Some.of([this.get, that.get])
    }

    unzip<U>(): [Option<T>, Option<U>] {
        if(this.isEmpty || !(this.get instanceof Array)) {
            return [None.unit(), None.unit()]
        } else {
            const value = this.get
            return [Some.of(value[0]), Some.of(value[1])]
        }
    }

    toArray() {
        return this.isEmpty ? [] : [this.get]
    }
}

export class Some<T> extends Option<T> {
    constructor(private value: T) {
        super()
    }

    static of<T>(value: T): Option<T> {
        return value == null
            ? new None()
            : new Some(value)
    }

    get isEmpty() {
        return false
    }

    get get(): T {
        return this.value
    }
}

export class None extends Option<null> {
    constructor() {
        super()
    }

    static unit(): None {
        return new None()
    }

    get isEmpty(): Boolean {
        return true
    }

    get get(): never {
        throw new EvalError("None.get")
    }
}

// // Usage examples
// const john = { firstname: "John", lastname: "Doe", age: Some.of(32) }
// const paul = { firstname: "Paul", lastname: "Doe", age: Some.of(28) }
// const meanAge = john.age.flatMap(x => paul.age.flatMap(y => Some.of((x + y) / 2)))
// const meanAgeSequence = Option.sequence(john.age, paul.age).map(x => x.reduce((a, b) => a + b) / x.length)
// console.log(meanAge)
// console.log(meanAgeSequence)

// // Let's test all of it
// let failedCount = 0
// const test = (label: string, assertion: Boolean) => {
//     if(assertion) {
//         console.info(label, "succeeded")
//     } else {
//         failedCount += 1
//         console.error(label, "failed")
//     }
// }
// const isSome = x => x instanceof Some
// const isNone = x => x instanceof None
// const isOption = x => x instanceof Option
// const valEq = <T>(x: Option<T>, y: T) => x instanceof Some && x.get === y

// const some1 = Some.of(1)
// const some2 = Some.of(2)
// const none = None.unit()
// console.log("-- Creation");
// test("Option.apply(1)", valEq(Option.apply(1), 1))
// test("Option.apply(undefined)", isNone(Option.apply(undefined)))
// test("Option.empty()", isNone(Option.empty()))
// test("Option.when", valEq(Option.when(2 === 2, 1), 1))
// test("Some.of(1)", valEq(Some.of(1), 1))
// test("Some.of(null)", isNone(Some.of(null)))
// console.log("-- Status");
// test("None.unit()", none.isEmpty)
// test("Some(1).isEmpty", !some1.isEmpty)
// test("None.isDefined", !none.isDefined)
// test("Some(1).isDefined", some1.isDefined)
// console.log("-- Access")
// test("None.get throws", (() => {
//     try { none.get; return false }
//     catch(e) { return true }
// })())
// test("Some(1).get", some1.get === 1)
// test("Some(1).getOrElse(100)", some1.getOrElse(100) === 1)
// test("None.getOrElse(100)", none.getOrElse(100) === 100)
// test("Some(1).orNull", some1.orNull === 1)
// test("None.orNull", none.orNull === null)
// test("Some(1).fold", some1.fold(x => x + 1, -1) === 2)
// test("None.fold", Some.of(null).fold(x => x + 1, -1) === -1)
// console.log("-- Flatmap and Map")
// test("Some(1).map", valEq(some1.map(x => x + 1), 2))
// test("None.map", isNone(Some.of(null).map(x => x + 1)))
// test("Some.flatMap(+1)", valEq(some1.flatMap(x => Some.of(x + 1)), 2))
// test("Some.flatMap(=> None)", isNone(some1.flatMap(_ => none)))
// test("None.flatMap", isNone(Some.of(null).flatMap(x => Some.of(x + 1))))
// console.log("-- Flatten")
// test("Some(Some(1)).flatten", valEq(Some.of(some1).flatten(), 1))
// test("Some(1).flatten", isNone(some1.flatten()))
// test("Some(None).flatten", isNone(Some.of(None).flatten()));

// (failedCount > 0 ? console.error : console.log)(`${failedCount} test${failedCount > 1 ? "s" : ""} failed.`) // lulcode