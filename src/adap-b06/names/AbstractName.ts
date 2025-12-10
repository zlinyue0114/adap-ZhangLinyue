import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";

/**
 * Abstract base class for immutable Name implementations.
 * Handles delimiter storage, equality contract, and basic string behavior.
 */
export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    /** Immutable objects may return themselves */
    public clone(): Name {
        return this;
    }

    /** Default string form uses the stored delimiter */
    public toString(): string {
        return this.asString(this.delimiter);
    }

    /** Printable API */
    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    /**
     * Equality contract:
     * Two Names are equal if their string representations (with same delimiter) match.
     */
    public isEqual(other: Name): boolean {
        if (this === other) return true;
        if (!other) return false;
        return this.asString(this.delimiter) === other.asString(this.delimiter);
    }

    /** Hash code based on string */
    public getHashCode(): number {
        const s = this.asString(this.delimiter);
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    /** Empty if no components */
    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** Must be implemented by concrete Name classes */
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;

    /** Immutable modification operations — MUST return new Name instances */
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;

    abstract append(c: string): Name;

    abstract remove(i: number): Name;

    abstract concat(other: Name): Name;

    /** Convert Name to a string with given delimiter */
    public abstract asString(delimiter?: string): string;

}
