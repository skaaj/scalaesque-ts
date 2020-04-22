import { Option, Some, None } from './Option';
import { Seq } from './Seq';

const sa = Some(1);
const na = None();
console.log(sa);
console.log(sa.map(x => x * 314));
console.log(na);
console.log(na.map(x => x * 314));
console.log(sa instanceof Some);
console.log(na instanceof None);
console.log(Option.sequence(
    Some(1),
    Some(2),
    Some(3)
));

const xs = Seq(1, 2, 3);
const res = Seq.range(10, 100)
    .flatMap(x => Seq(x*x, x*x))
    .zip(Seq.range(0, 1000))
    .headOption();

console.log(res)
console.log(xs instanceof Seq);