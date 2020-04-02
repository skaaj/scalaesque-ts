import { Option, Some, None } from './Option.wip';

const sa = Some(42);
const sb = sa.map(x => x * 100);
const sc = sb.flatMap(x => None());
const sd = Option.sequence(sa, sb, sc.orElse(Some(1992)));
const se = sd.getOrElse("N/A");
console.log(sa instanceof Some);
console.log(sc instanceof None);
console.log(sd);
console.log(se);
console.log(None() instanceof None);