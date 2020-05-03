# scalaesque-ts
Attempt to mimic Scala types in TypesScript.

## Option
```kind: OptionKind```  

```isEmpty: boolean```

```isDefined: boolean```

```get(): T | never```  

```getOrElse<U>(defaultValue: U): T | U```  

```map<U>(f: (x: T) => U): Option<U>```

```fold<U>(f: (x: T) => U, defaultValue: U): U```

```flatMap<U>(f: (x: T) => Option<U>): Option<U>```

```flatten(): Option<unknown> | never```

```filter(pred: (x: T) => Boolean): Option<T>```

```contains<U extends T>(elem: U): Boolean```

```exists(pred: (x: T) => Boolean): Boolean```

```forall(pred: (x: T) => Boolean): Boolean```

```foreach<U>(f: (x: T) => U): void```

```orElse<U>(defaultValue: Option<U>): Option<T> | Option<U>```

```zip<U>(that: Option<U>): Option<[T, U]> | None```

```unzip<U>(): [Option<T>, Option<U>]```

```toArray<T>(): Array<T>```