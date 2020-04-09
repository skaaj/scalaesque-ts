import { Option, Some, None } from './Option';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

let i = 0;
let minusOne = (x: number) => x - 1;
let plusOne = (x: number) => x + 1;

const s1 = Some(100);

let mapresult1: Option<number> = Some(0);

import { Box } from './Box';
console.log(Box(12));
console.log(Box(12) instanceof Box);

// suite
// .add('Some Creation', function() {
//   mapresult1 = Some(100);
// })
// .add('Some Mapping', function() {
//   mapresult1 = s1.map(plusOne).map(minusOne).map(plusOne);
// })
// .on('cycle', function(event) {
//   console.log(String(event.target));
// })
// .on('complete', function() {
//   console.log('Fastest is ' + this.filter('fastest').map('name'));
//   console.log(mapresult1);
// })
// .run({ 'async': true });