import { Option, Some, None } from '../src/Option'

describe("None test suite", () => {
    test("none.get should throw", () => {
        expect(() => None().get()).toThrow();
    });

    test("none.getOrElse should output the default value", () => {
        expect(None().getOrElse(0)).toBe(0);
    });

    test("none.map(f) should output none", () => {
        expect(None()).toBe(None());
    });

    test("none.fold(f, v) should output the default value", () => {
        expect(None().fold(x => x + 22, 0)).toBe(0);
    });

    test("none.flatMap(f) should always output none", () => {
        expect(None().flatMap(x => Some(x + 22))).toBe(None());
        expect(None().flatMap(x => None())).toBe(None());
    });

    test("none.flatten() should output none", () => {
        expect(None().flatten()).toBe(None());
    });

    test("none.filter(p) should output none", () => {
        expect(None().filter(x => x > 10)).toBe(None());
    });

    test("none.contains(e) should output false", () => {
        const opt: Option<number> = None();
        expect(opt.contains(42)).toBe(false);
    });

    test("none.exists(p) should output false", () => {
        expect(None().exists(x => x > 10)).toBe(false);
    });

    test("none.forall(p) should", () => {
        expect(None().forall(x => x > 10)).toBe(true);
    });

    test("none.foreach(f) should not execute f", () => {
        const mockFunc = jest.fn(x => { /* some side effect */ });
        None().foreach(mockFunc);
        expect(mockFunc.mock.calls.length).toBe(0);
    });

    test("none.orElse(v) should output default option", () => {
        expect(None().orElse(None())).toBe(None());
        expect(None().orElse(Option(null))).toBe(None());
        expect(None().orElse(Some(0))).toEqual(Some(0));
        expect(None().orElse(Option(0))).toEqual(Some(0));
    });

    test("none.zip(other) should output none", () => {
        expect(None().zip(Some(10))).toBe(None());
    });

    test("none.unzip() should output pair of nones", () => {
        expect(None().unzip()).toEqual([None(), None()]);
    });

    test("none.toArray() should output an empty array", () => {
        expect(Some(42).toArray()).toEqual([42]);
    });
});