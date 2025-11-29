import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertValidDelimiterAsPrecondition(delimiter);
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public clone(): Name {
        const cloned = this.createEmptyWithDelimiter(this.delimiter);

        for (let i = 0; i < this.getNoComponents(); i++) {
            cloned.append(this.doGetComponent(i));
        }
        this.assertClassInvariants();
        return cloned;
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.doGetComponent(i) !== other.getComponent(i)) return false;
        }

        return true;
    }

    public getHashCode(): number {
        let hash = 17;
        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.doGetComponent(i);
            for (let j = 0; j < comp.length; j++) {
                hash = hash * 31 + comp.charCodeAt(j);
            }
        }
        return hash;
    }


    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiterAsPrecondition(delimiter);

        const unmasked: string[] = [];

        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.doGetComponent(i);
            this.assertValidMaskedComponentAsPrecondition(comp);
            unmasked.push(this.unmask(comp));
        }

        const result = unmasked.join(delimiter);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            typeof result !== "string",
            "asString: result not string"
        );

        this.assertClassInvariants();
        return result;
    }

    // public toString(): string {
    //     const masked = [];
    //     for (let i = 0; i < this.getNoComponents(); i++) {
    //         const comp = this.doGetComponent(i);
    //         this.assertValidMaskedComponentAsPrecondition(comp);
    //         const raw = this.unmask(comp);
    //         masked.push(this.mask(raw, DEFAULT_DELIMITER));
    //     }

    //     const result = masked.join(DEFAULT_DELIMITER);

    //     MethodFailedException.assertCondition(
    //         typeof result === "string",
    //         "asDataString failed: result not string"
    //     );

    //     this.assertClassInvariants();
    //     return result;
    // }

    public asDataString(): string {
        const masked: string[] = [];

        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.doGetComponent(i);
            this.assertValidMaskedComponentAsPrecondition(comp);

            const raw = this.unmask(comp);
            masked.push(this.mask(raw, DEFAULT_DELIMITER));
        }

        const result = masked.join(DEFAULT_DELIMITER);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            typeof result !== "string",
            "asDataString: result not string"
        );

        this.assertClassInvariants();
        return result;
    }


    // public isEqual(other: Name): boolean {
    //     throw new Error("needs implementation or deletion");
    // }

    // public getHashCode(): number {
    //     throw new Error("needs implementation or deletion");
    // }

    // public isEmpty(): boolean {
    //     throw new Error("needs implementation or deletion");
    // }

    // public getDelimiterCharacter(): string {
    //     throw new Error("needs implementation or deletion");
    // }

    // abstract getNoComponents(): number;

    public getComponent(i: number): string {
        this.assertValidIndexAsPrecondition(i);
        const c = this.doGetComponent(i);

        this.assertValidMaskedComponentAsPostcondition(c);
        this.assertClassInvariants();

        return c;
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndexAsPrecondition(i);
        this.assertValidMaskedComponentAsPrecondition(c);

        this.doSetComponent(i, c);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.doGetComponent(i) !== c,
            "setComponent: value not updated"
        );

        this.assertClassInvariants();
    }

    public insert(i: number, c: string): void {
        this.assertValidIndexAllowEndAsPrecondition(i);
        this.assertValidMaskedComponentAsPrecondition(c);

        const oldCount = this.getNoComponents();

        this.doInsert(i, c);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.getNoComponents() !== oldCount + 1,
            "insert: count did not increase"
        );

        this.assertClassInvariants();
    }

    public append(c: string): void {
        this.assertValidMaskedComponentAsPrecondition(c);

        const oldCount = this.getNoComponents();

        this.doAppend(c);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.getNoComponents() !== oldCount + 1,
            "append: count did not increase"
        );

        this.assertClassInvariants();
    }

    public remove(i: number): void {
        this.assertValidIndexAsPrecondition(i);

        const oldCount = this.getNoComponents();

        this.doRemove(i);

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.getNoComponents() !== oldCount - 1,
            "remove: count did not decrease"
        );

        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        this.assertNotNullAsPrecondition(other);
        this.assertValidDelimiterAsPrecondition(other.getDelimiterCharacter());

        const oldCount = this.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            const c = other.getComponent(i);
            this.assertValidMaskedComponentAsPrecondition(c);
            this.doAppend(c);
        }

        AssertionDispatcher.dispatch(
            ExceptionType.POSTCONDITION,
            this.getNoComponents() !== oldCount + other.getNoComponents(),
            "concat: count not increased correctly"
        );

        this.assertClassInvariants();
    }

    protected abstract createEmptyWithDelimiter(del: string): AbstractName;

    protected abstract doGetComponent(i: number): string;
    protected abstract doSetComponent(i: number, c: string): void;
    protected abstract doInsert(i: number, c: string): void;
    protected abstract doAppend(c: string): void;
    protected abstract doRemove(i: number): void;

    abstract getNoComponents(): number;

    protected mask(raw: string, delimiter: string): string {
        let out = "";
        for (let i = 0; i < raw.length; i++) {
            const ch = raw[i];
            if (ch === ESCAPE_CHARACTER || ch === delimiter) out += ESCAPE_CHARACTER;
            out += ch;
        }
        return out;
    }

    protected unmask(masked: string): string {
        let out = "";
        for (let i = 0; i < masked.length; i++) {
            const ch = masked[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < masked.length) {
                    out += masked[i + 1];
                    i++;
                } else {
                    out += ESCAPE_CHARACTER;
                }
            } else {
                out += ch;
            }
        }
        return out;
    }

    protected assertNotNullAsPrecondition(x: any): void {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            x === null || x === undefined,
            "value is null or undefined"
        );
    }

    protected assertValidIndexAsPrecondition(i: number): void {
        const n = this.getNoComponents();
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            i < 0 || i >= n,
            `index ${i} out of range`
        );
    }

    protected assertValidIndexAllowEndAsPrecondition(i: number): void {
        const n = this.getNoComponents();
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            i < 0 || i > n,
            `index ${i} out of range for insert`
        );
    }

    protected assertValidDelimiterAsPrecondition(del: string): void {
        AssertionDispatcher.dispatch(
            ExceptionType.PRECONDITION,
            !del || del.length !== 1,
            "delimiter must be a single character"
        );
    }

    protected assertValidMaskedComponentAsPrecondition(c: string): void {
        if (c === null || c === undefined) {
            AssertionDispatcher.dispatch(
                ExceptionType.PRECONDITION,
                true,
                "component is null"
            );
        }
        for (let i = 0; i < c.length; i++) {
            const ch = c[i];
            if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                AssertionDispatcher.dispatch(
                    ExceptionType.PRECONDITION,
                    true,
                    "component not properly masked"
                );
            }
        }
    }

    protected assertValidMaskedComponentAsPostcondition(c: string): void {
        this.assertValidMaskedComponent(ExceptionType.POSTCONDITION, c);
    }

    protected assertValidMaskedComponent(et: ExceptionType, c: string): void {
        if (c === null || c === undefined) {
            AssertionDispatcher.dispatch(et, true, "component is null");
        }
        for (let i = 0; i < c.length; i++) {
            const ch = c[i];
            if (ch === this.delimiter || ch === ESCAPE_CHARACTER) {
                AssertionDispatcher.dispatch(
                    et,
                    true,
                    "component not properly masked"
                );
            }
        }
    }

    protected assertClassInvariants(): void {
        // delimiter must be single character
        AssertionDispatcher.dispatch(
            ExceptionType.CLASS_INVARIANT,
            !this.delimiter || this.delimiter.length !== 1,
            "invalid delimiter"
        );

        // component validity
        for (let i = 0; i < this.getNoComponents(); i++) {
            const c = this.doGetComponent(i);
            this.assertValidMaskedComponent(
                ExceptionType.CLASS_INVARIANT,
                c
            );
        }
    }
}