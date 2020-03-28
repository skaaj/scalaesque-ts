import { Some, None } from './Option'

const sa = Some(42);
const sb = sa.map(x => x * 100);
const sc = sa.flatMap(x => None);
console.log(sa instanceof Some);