import { Some as OldSome } from './Option';
import { Some } from './Option.wip';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

let i = 0;
let minusOne = (x: number) => x - 1;
let plusOne = (x: number) => x + 1;

const s1 = OldSome(100);
const s2 = Some(100);

console.log(Some(30));

suite
.add('Some Creation', function() {
  const x = OldSome(i++);
})
.add('WIP Creation', function() {
  const x = Some(i--);
})
.add('Some Mapping', function() {
  const y = s1.map(plusOne).map(minusOne);
})
.add('WIP Mapping', function() {
  const y = s2.map(minusOne).map(plusOne);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });