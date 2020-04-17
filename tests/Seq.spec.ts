import { Seq } from '../src/Seq'
import { Option, Some, None} from '../src/Option'

describe("Seq test suite", () => {
  test("seq.head should return the head", () => {
      expect(Seq.of(1, 2, 3).head).toBe(1);
  });
  
  test("seq.tail should return the tail", () => {
    const [...tail] = Seq.of(1, 2, 3).tail;
    expect(tail).toEqual([2, 3]);
  });
  
  test("seq.headOption should return an Option", () => {
    expect(Seq.of(1, 2, 3).headOption).toStrictEqual(Some(1));
    expect(Seq.empty().headOption).toStrictEqual(None());
  });
  
  test("seq should be decomposable through spread syntax", () => {
    const [head, ...tail] = Seq.of(1, 2, 3);
    expect(head).toBe(1);
    expect(tail).toEqual([2, 3]);
  });

  test("Seq.range should create a new seq", () => {
      expect(Seq.range(1, 4)).toEqual(Seq.of(1, 2, 3));
  });
  
  test("Seq.from can create a seq from an array", () => {
    expect(Seq.from([1, 2, 3])).toEqual(Seq.of(1, 2, 3));
  });
  
  test("Seq.from can create a seq from a set", () => {
    expect(Seq.from(new Set([1, 2, 3]))).toEqual(Seq.of(1, 2, 3));
  });

  test("Seq.create should create a seq from a generator function", () => {
    const seq = Seq.create(function* () {
      yield 1;
      yield 2;
      yield 3;
    });
    
    expect(seq).toEqual(Seq.of(1, 2, 3));
  });
  
  test("Seq.empty should create an empty seq", () => {
    expect(Seq.empty()).toEqual(Seq.of())
  });

  test("seq.toArray should return the sequence as an array", () => {
    expect(Seq.of(1, 2, 3).toArray()).toEqual([1, 2, 3]);
  });
  
  test("seq.map(f) should output a sequence with f applied to every item", () => {
    expect(Seq.of(1, 2, 3).map(x => x + 1)).toEqual(Seq.of(2, 3, 4));
  });
  
  test("seq.flatMap(f) should output a flattened sequence with f applied to every item", () => {
    expect(Seq.of(1, 2, 3).flatMap(x => Seq.of(x + 1))).toEqual(Seq.of(2, 3, 4));
  });

  test("seq.foreach should call given function for every item", () => {
    const mockFunc = jest.fn(x => { /* some side effect */ });
    Seq.of(1, 2, 3).foreach(mockFunc);

    expect(mockFunc.mock.calls[0][0]).toBe(1);
    expect(mockFunc.mock.calls[1][0]).toBe(2);
    expect(mockFunc.mock.calls[2][0]).toBe(3);
    expect(mockFunc.mock.calls.length).toBe(3);
  });

  test("seq.filter(p) should filter items", () => {
    expect(Seq.of(1, 2, 3).filter(x => x > 1)).toEqual(Seq.of(2, 3));
  });

  test("seq.concat(other) should concat other seq", () => {
    expect(Seq.of(1, 2, 3).concat(Seq.of(4, 5))).toEqual(Seq.of(1, 2, 3, 4, 5));
  });

  test("seq.take(n) should take only 'n' items from the beginning", () => {
    expect(Seq.of(1, 2, 3).take(2)).toEqual(Seq.of(1, 2));
  });

  test("seq.take(n) where 'n' is higher than the seq length should return seq", () => {
    expect(Seq.of(1, 2, 3).take(100)).toEqual(Seq.of(1, 2, 3));
  });

  test("seq.take(0) should return an empty seq", () => {
    expect(Seq.of(1, 2, 3).take(0)).toEqual(Seq.empty());
  });

  test("seq.drop(n) should drop only 'n' items from the beginning", () => {
    expect(Seq.of(1, 2, 3).drop(2)).toEqual(Seq.of(3));
  });

  test("seq.drop(n) where 'n' is higher than the seq length should return an empty seq", () => {
    expect(Seq.of(1, 2, 3).drop(100)).toEqual(Seq.empty());
  });

  test("seq.drop(0) should return seq", () => {
    expect(Seq.of(1, 2, 3).drop(0)).toEqual(Seq.of(1, 2, 3));
  });

  test("seq.append(x) should add item x at the end", () => {
    expect(Seq.of(1, 2, 3).append(4)).toEqual(Seq.of(1, 2, 3, 4));
  });

  test("seq.prepend(x) should add item x at the beginning", () => {
    expect(Seq.of(1, 2, 3).prepend(0)).toEqual(Seq.of(0, 1, 2, 3));
  });

  test("seq.dropWhile(p) should drop first items that satisfy the predicate", () => {
    expect(Seq.of(1, 2, 3).dropWhile(x => x < 3)).toEqual(Seq.of(3));
  });
});