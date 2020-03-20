import { Seq } from '../src/Seq'


describe("Seq test suite", () => {
  test("Should return the head of the seq", () => {
      const list = Seq.of<number>(1,2,3);
      expect(list.head).toBe(1);
  })
  test("Should return the tail of the seq", () => {
    const list = Seq.of<number>(1,2,3);
    const [...tail] = list.tail
    expect(tail).toEqual([2,3]);
  })
  
  test("Should return head from headOption", () => {
    const list = Seq.of<number>(1,2,3);
    expect(list.headOption.get).toBe(1);
  })
  
  test("Should throw an EvalError for empty Seq ", () => {
    const list = Seq.of<undefined>();
    expect(() => list.headOption.get).toThrowError(new EvalError("None.get"));
  })
  
  test("Should return an array", () => {
    const list = Seq.of<number>(1,2,3);
    const mapList = list.map(f => f + 1).toArray();
    expect(mapList).toEqual([2,3,4]);
  })
  
  test("Should return an array with 2 elements", () => {
    const list = Seq.of<number>(1,2,3);
    const mapList = list.map(f => f + 1).take(2).toArray();
    expect(mapList).toEqual([2,3]);
  })
  
  // test("Should return a flatted array", () => {
  //   const nestedList = Seq.of<Array<number>>([1,2], [3,4]);
  //   const flattedList = nestedList.flatMap(f => Seq.of(f)).toArray();
    
  //   expect(flattedList).toEqual([1,2,3,4]);
  // } ) 
  
  test("Should create a Seq from range", () => {
      const list = Seq.range(0, 4);
      const listExpected = Seq.of(0,1,2,3)
      expect(list).toEqual(listExpected);
  })
  
  test("Should create a Seq from Array", () => {
    const list = Seq.from([1,2,3,4]);
    expect(list).toEqual(Seq.of(1,2,3,4));
  })
  
  test("Should create a Seq from a generator function", () => {
    const list = Seq.create(function*() {
      yield 1
      yield 2
      yield 3
    });
    
    expect(list).toEqual(Seq.of(1,2,3));
  })
  
  test("Should create an empty Seq", () => {
    const emptyList = Seq.empty()
    expect(emptyList).toEqual(Seq.of())
  })
  
  test("Should create a Seq with just one element", () => {
    const list = Seq.just({foo: 'bar'});
    expect(list).toEqual(Seq.from([{foo: 'bar'}]));
  })
  
})