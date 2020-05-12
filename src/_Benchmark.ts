import { Seq } from "./Seq"
import { Seq as LegacySeq } from "./Seq.old"

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const generator = function* () {
    let i = 0;
    const max = 10000000;
    while(i < max) {
        yield i;
        i++;
    }
}

const xs = Seq.create(generator);
const ys = LegacySeq.create(generator);

const sum = (iterable) => {
    let s = 0;
    for(const x of iterable) {
        s += x;
    }
    return s;
}

suite
.add('Array (std)', function() {
    const res = ys
        .map(x => x + 10)
        .filter(x => x % 2 == 0);
        sum(res);
})
.add('Seq (lazy and cached)', function() {
    const res = xs
        .map(x => x + 1)
        .filter(x => x % 2 == 0);
    sum(res);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
    const slowest = this.filter('slowest').map('times')[0].period;
    const fastest = this.filter('fastest').map('times')[0].period;
    const factor = slowest / fastest;
    console.log('Fastest is ' + this.filter('fastest').map('name') + ' (' + factor + ' times faster)');
})
.run({ 'async': true, 'delay': 60 });