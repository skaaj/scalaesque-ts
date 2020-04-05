import { Option, Some, None } from './Option';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

let i = 0;
let minusOne = (x: number) => x - 1;
let plusOne = (x: number) => x + 1;

const s1 = Some(100);

let mapresult: Option<number> = Some(0);

suite
.add('Some Creation', function() {
  const x = Some(i++);
})
.add('Some Mapping', function() {
  mapresult = s1.map(plusOne).map(minusOne).map(plusOne);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log(mapresult);
})
.run({ 'async': true });