import { Option, Some, None } from '../src/Option'

describe("Option test suite", () => {
    test("Option constructor should return Some when argument is not null or undefined", () => {
        expect(Option(314)).toEqual(Some(314));
    });

    test("Option constructor should return None when argument is null or undefined", () => {
        expect(Option(null)).toBe(None());
        expect(Option(undefined)).toEqual(None());
    });

    test("Option type guards should all work", () => {
        expect(Option.isOption(Some(314))).toBe(true);
        expect(Option.isOption(None())).toBe(true);
        expect(Option.isSome(Some(314))).toBe(true);
        expect(Option.isSome(None())).toBe(false);
        expect(Option.isNone(Some(314))).toBe(false);
        expect(Option.isNone(None())).toBe(true);
    });

    test("Option.sequence should return right type depending of the presence of None", () => {
        const someSequence = Option.sequence(Some(314), Some(-314));
        const noneSequence = Option.sequence(Some(314), None());
        expect(Option.isSome(someSequence)).toBe(true);
        expect(Option.isNone(noneSequence)).toBe(true);
    });
});