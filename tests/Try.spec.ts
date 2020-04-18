import { Option, Some, None } from '../src/Option'
import { Try, Success, Failure } from '../src/Try'
import { fail } from 'assert';

const value = "ok";
const error = new Error("failure");
const oopsError = new Error("oops");
const success = Success(value);
const failure = Failure(error);
const oopsFailure = Failure(oopsError);
const coolFunction = () => value;
const badFunction = () => { throw error; };
const oopsFunction = <T>(x: T) => { throw oopsError; };

describe("Try test suite", () => {
    test("try constructors", () => {
        expect(Try(coolFunction)).toEqual(success);
        expect(Try(badFunction)).toEqual(failure);
        expect(Success(value)).toEqual(success);
        expect(Failure(error)).toEqual(failure);
    });

    test("try type guards", () => {
        expect(Try.isSuccess(success)).toEqual(true);
        expect(Try.isSuccess(failure)).toEqual(false);
        expect(Try.isFailure(success)).toEqual(false);
        expect(Try.isFailure(failure)).toEqual(true);
        expect(Try.isTry(success)).toEqual(true);
        expect(Try.isTry(failure)).toEqual(true);
    })

    test("try.isSuccess", () => {
        expect(success.isSuccess()).toBe(true);
        expect(failure.isSuccess()).toBe(false);
    });

    test("try.isFailure", () => {
        expect(success.isFailure()).toBe(false);
        expect(failure.isFailure()).toBe(true);
    });

    test("try.getOrElse", () => {
        expect(success.getOrElse("default")).toEqual(value);
        expect(failure.getOrElse("default")).toEqual("default");
    });

    test("try.orElse", () => {
        expect(success.orElse(failure)).toBe(success);
        expect(failure.orElse(success)).toBe(success);
    });

    test("try.get", () => {
        expect(success.get()).toBe(value);
        expect(() => failure.get()).toThrow();
    });

    test("try.foreach(f)", () => {
        const mockFailureFunction = jest.fn(x => { /* some side effect */ });
        const mockSuccessFunction = jest.fn(x => { /* some side effect */ });
        failure.foreach(mockFailureFunction);
        success.foreach(mockSuccessFunction);
        expect(mockFailureFunction.mock.calls.length).toBe(0);
        expect(mockSuccessFunction.mock.calls.length).toBe(1);
        expect(mockSuccessFunction.mock.calls[0][0]).toBe(value);
    });

    test("try.flatMap", () => {
        const superbSuccess = Success("superb");
        const poorFailure = Failure(new Error("oops"));
        expect(success.flatMap(x => superbSuccess)).toBe(superbSuccess);
        expect(success.flatMap(x => failure)).toBe(failure);
        expect(failure.flatMap(x => superbSuccess)).toBe(failure);
        expect(failure.flatMap(x => poorFailure)).toBe(failure);
    });

    test("try.map", () => {
        const superbSuccess = Success("superb");
        expect(success.map(x => "superb")).toEqual(superbSuccess);
        expect(success.map(oopsFunction)).toEqual(oopsFailure);
        expect(failure.map(x => "superb")).toBe(failure);
    });

    test("try.filter", () => {
        expect(success.filter(x => true)).toBe(success);
        expect(success.filter(x => false)).toBeInstanceOf(Failure);
        expect(success.filter(oopsFunction)).toEqual(oopsFailure);
        expect(failure.map(x => true)).toBe(failure);
        expect(failure.map(x => false)).toBe(failure);
        expect(failure.map(x => { throw oopsError; })).toBe(failure);
    });

    test("try.flatten", () => {
        expect(Success(success).flatten()).toBe(success);
        expect(Success(value).flatten()).toBeInstanceOf(Failure);
        expect(Success(failure).flatten()).toBe(failure);
        expect(failure.flatten()).toBe(failure);
    });

    test("try.transform", () => {
        expect(Success(1).transform(x => Success(x * 2), e => Success(0))).toEqual(Success(2));
        expect(Success(1).transform(x => Failure(error), e => Failure(oopsError))).toEqual(Failure(error));
        expect(Success(1).transform(oopsFunction, e => Success(0))).toBeInstanceOf(Failure);
        expect(Success(1).transform(x => Success(x * 2), oopsFunction)).toEqual(Success(2));
        expect(Failure(error).transform(x => Success(1), e => Success(0))).toEqual(Success(0));
        expect(Failure(error).transform(x => Failure(error), e => Failure(oopsError))).toEqual(Failure(oopsError));
        expect(Failure(error).transform(oopsFunction, e => Success(0))).toEqual(Success(0));
        expect(Failure(error).transform(x => Success(1), oopsFunction)).not.toEqual(Failure(error));
        expect(Failure(error).transform(x => Success(1), oopsFunction)).toBeInstanceOf(Failure);
    });

    test("try.fold", () => {
        expect(Success(1).fold(x => x * 2, e => 0)).toBe(2);
        expect(() => Success(1).fold(oopsFunction, e => 0)).toThrow();
        expect(Success(1).fold(x => x * 2, oopsFunction)).toBe(2);
        expect(Failure(error).fold(x => 1, e => 0)).toBe(0);
        expect(Failure(error).fold(oopsFunction, e => 0)).toBe(0);
        expect(() => Failure(error).fold(x => 1, oopsFunction)).not.toThrowError(error);
        expect(() => Failure(error).fold(x => 1, oopsFunction)).toThrow();
    });
});