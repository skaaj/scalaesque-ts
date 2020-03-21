import { Seq } from './Seq'

const xs =  Seq.of(1, 2, 3);
const head = xs.headOption;
console.log(head);