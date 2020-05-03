# scalaesque-ts
Attempt to mimic Scala types in TypesScript.

## Option
    kind: OptionKind
    isEmpty: boole
    isDefined: boole
    get(): T | never
    getOrElse<U>(defaultValue: U): T | U
    map<U>(f: (x: T) => U): Option<U>
    fold<U>(f: (x: T) => U, defaultValue: U): U
    flatMap<U>(f: (x: T) => Option<U>): Option<U>
    flatten(): Option<unknown> | never
    filter(pred: (x: T) => Boolean): Option<T>
    contains<U extends T>(elem: U): Boolean
    exists(pred: (x: T) => Boolean): Boolean
    forall(pred: (x: T) => Boolean): Boolean
    foreach<U>(f: (x: T) => U): void
    orElse<U>(defaultValue: Option<U>): Option<T> | Option<U>
    zip<U>(that: Option<U>): Option<[T, U]> | None
    unzip<U>(): [Option<T>, Option<U>]
    toArray<T>(): Array<T>

## Try
    kind: TryKind
    isFailure(): Boolean
    isSuccess(): Boolean
    getOrElse<U>(defaultValue: U): T | U
    orElse<U>(other: Try<U>): Try<T | U>
    get(): T
    foreach<U>(f: (x: T) => U): void
    flatMap<U>(f: (x: T) => Try<U>): Try<U>
    map<U>(f: (x: T) => U): Try<U>
    filter(p: (x: T) => Boolean): Try<T>
    flatten(): Try<unknown>
    transform<U>(s: (x: T) => Try<U>, f: (t: Error) => Try<U>): Try<U>
    fold<U>(s: (x: T) => U, f: (t: Error) => U): U

## Seq
    head(): T
    headOption(): Option<T>
    tail(): Seq<T>
    map<U>(f: (x: T) => U): Seq<U>
    foreach<U>(f: (x: T) => U): void
    flatMap<U>(f: (x: T) => Seq<U>): Seq<U>
    filter(p: (x: T) => boolean): Seq<T>
    concat(other: Iterable<T>): Seq<T>
    append(x: T): Seq<T>
    prepend(x: T): Seq<T>
    take(n: number): Seq<T>
    drop(n: number): Seq<T>
    dropWhile(p: (x: T) => boolean): Seq<T>
    zip<U>(other: Iterable<U>): Seq<[T, U]>
    contains(value: T): boolean
    exists(p: (x: T) => boolean): boolean
    forall(p: (x: T) => boolean): boolean
    count(p: (x: T) => boolean): number
    toArray(): Array<T>