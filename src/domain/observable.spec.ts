import { Subject } from "./observable";

describe("Observables", () => {
    it("to pass data to subscribers", () => {
        const subject = new Subject();
        const spy = jest.fn();
        subject.subscribe(spy);
        subject.next("T");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('T');
    });

    it("should unsubscribe", () => {
        const subject = new Subject();
        const spy = jest.fn();
        subject.subscribe(spy).unsubscribe();;
        subject.next("T");
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it("to pass data to the right observer on unsibscribe", () => {
        const subject = new Subject();
        const spy = jest.fn();
        const spy2 = jest.fn();
        subject.subscribe(spy);
        subject.subscribe(spy2).unsubscribe();
        subject.next("T");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('T');
        expect(spy2).toHaveBeenCalledTimes(0);
    });
})