import { Some } from './Option';
<<<<<<< HEAD
import { Some_WIP as WIP } from './Option.wip';
=======
>>>>>>> a5264fb7c4167be1a9f3bc71ed7985e9a1e17f88

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

<<<<<<< HEAD
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
=======
let i = 0;

suite
.add('Some(i)', function() {
    let s = Some(i);
    let t = s.get;
>>>>>>> a5264fb7c4167be1a9f3bc71ed7985e9a1e17f88
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });