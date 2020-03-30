import { Some } from './Option';
import { Some_WIP as WIP } from './Option.wip';

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

console.log(WIP(1337));

let i = 0;

suite
.add('Some(10)', function() {
  const x = Some(i++);
  // const y = x.value;
})
.add('WIP(10)', function() {
  const x = WIP(i++);
  // const y = x.value;
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });