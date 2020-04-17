import { Option, Some, None } from '../src/Option'

describe("Some test suite", () => {
    test("some.get should unwrap the inner value", () => {
        expect(Some(42).get()).toBe(42);
    });

    test("some.getOrElse should unwrap the inner value", () => {
        expect(Some(42).getOrElse(0)).toBe(42);
    });

    test("some.map(f) should output a some with f applied to inner value", () => {
        expect(Some(42).map(x => x + 22)).toEqual(Some(64));
    });

    test("some.fold(f, _) should output the result of f applied to inner value", () => {
        expect(Some(42).fold(x => x + 22, 0)).toEqual(64);
    });

    test("some.flatMap(f) should output a flattened some with f applied to inner value", () => {
        expect(Some(42).flatMap(x => Some(x + 22))).toEqual(Some(64));
        expect(Some(42).flatMap(x => None())).toEqual(None());
    });

    test("some.flatten() should flatten some or throw if impossible", () => {
        expect(Some(Some(42)).flatten()).toEqual(Some(42));
        expect(Some(None()).flatten()).toEqual(None());
        expect(() => Some(100).flatten()).toThrow();
    });

    test("some.filter(p) should output none if predicate doesn't hold", () => {
        const some = Some(42);
        expect(some.filter(x => x > 10)).toEqual(some);
        expect(some.filter(x => x < 10)).toEqual(None());
    });

    test("some.contains(e) should indicate if inner value is e", () => {
        expect(Some(42).contains(42)).toBe(true);
        expect(Some(42).contains(68)).toBe(false);
    });

    test("some.exists(p) should indicate if inner value satisfies predicate", () => {
        expect(Some(42).exists(x => x > 10)).toBe(true);
        expect(Some(42).exists(x => x < 10)).toBe(false);
    });

    test("some.forall(p) should indicate if inner value satisfies predicate", () => {
        expect(Some(42).forall(x => x > 10)).toBe(true);
        expect(Some(42).forall(x => x < 10)).toBe(false);
    });

    test("some.foreach(f) should execute side effecting or empty function f", () => {
        const mockFunc = jest.fn(x => { /* some side effect */ });
        Some(42).foreach(mockFunc);
        expect(mockFunc.mock.calls[0][0]).toBe(42);
        expect(mockFunc.mock.calls.length).toBe(1);
    });

    test("some.orElse(_) should output same instance", () => {
        const some = Some(42);
        expect(some.orElse(None())).toBe(some);
        expect(some.orElse(Some(0))).toBe(some);
    });

    test("some.zip(other) should output some pair of values or none if other doesn't have one", () => {
        expect(Some(42).zip(Some(10))).toEqual(Some([42, 10]));
        expect(Some(42).zip(None())).toEqual(None());
    });

    test("some.unzip() should output pair of somes if input has exactly two values, nones otherwise", () => {
        expect(Some([42, 10]).unzip()).toEqual([Some(42), Some(10)]);
        expect(Some([]).unzip()).toEqual([None(), None()]);
        expect(Some([42]).unzip()).toEqual([None(), None()]);
        expect(Some([42, 10, 314]).unzip()).toEqual([None(), None()]);
    });

    test("some.toArray() should output a 1-length array filled with the inner value", () => {
        expect(Some(42).toArray()).toEqual([42]);
    });
});