interface Some {
    get: number;
}

function $Some(value: number) {
    this.value = value;
}

const proto = {
    get() {
        return this.value;
    }
}

// $Some.prototype.get = function() {
//     return this.value;
// }

// $Some.prototype.print = function() {
//     console.log(this.value);
// }

//Object.setPrototypeOf($Some, proto);



$Some.prototype = {...proto}

function Some(value: number) {
    return new $Some(value);
}

console.log(Some(42));

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

// add tests
suite
.add('_Some(10)', function() {
    let x = Some(10);
    let y = x.get;
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });