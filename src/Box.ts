declare class Box<T> implements Box<T> {
    get(): T;
}

function Box<T>(value: T) {
    return new Box(value);
}

console.log(Box(20));

export { Box }