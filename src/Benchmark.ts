import { Some } from './Option';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

let i = 0;

suite
.add('Some(i)', function() {
    let s = Some(i);
    let t = s.get;
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });