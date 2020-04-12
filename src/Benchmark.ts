import { Option, Some, None } from './Option';
import { Try, Success, Failure } from './Try';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

let i = 0;
let minusOne = (x: number) => x - 1;
let plusOne = (x: number) => x + 1;

const s1 = Some(100);
const t1 = Try(() => { throw new Error("ok"); });

let mapresult1: Option<number> = Some(0);
let mapresult2: Try<number> = Success(12);

console.log(s1 instanceof Some);

suite
    .add('Some Creation', function () {
        mapresult2 = Try(() => 42);
    })
    .add('Some Mapping', function () {
        mapresult2 = t1.map(plusOne).map(minusOne).map(plusOne);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        console.log(mapresult2);
    })
    .run({ 'async': true });