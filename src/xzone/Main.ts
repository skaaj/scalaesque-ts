import { LazySeq } from "./LazyIterable"

function* generator() {
    console.log("Computing 1...");
    yield 1;
    console.log("Computing 2...");
    yield 2;
    console.log("Computing 3...");
    yield 3;
}

const iterable = new LazySeq<number>(generator());

let boom = 0;
console.log("First pass.");
for(let x of iterable) {
    console.log(x);
    boom++;
    if(boom > 1) {
        break;
    }
}

console.log("Second pass.");
for(let x of iterable) {
    console.log(x);
}

console.log("Third pass.");
for(let x of iterable) {
    console.log(x);
}

// for(let x of iterable) {
//     console.log(x);
// }