import { Option, Some, None } from './Option';

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