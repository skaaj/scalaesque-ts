const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

suite
.add('Nothing', function() {
    // nothing
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });