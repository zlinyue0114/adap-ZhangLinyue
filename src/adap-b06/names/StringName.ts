import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { DEFAULT_DELIMITER } from "../common/Printable";

/**
 * Immutable Name implementation using a single string internally.
 */
export class StringName extends AbstractName {

    private readonly name: string;
    private readonly noComponents: number;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        this.name = source;

        // split based on delimiter to count components
        this.noComponents = (source.length === 0)
            ? 0
            : source.split(delimiter).length;
    }

    /** Immutable clone — may return this */
    public override clone(): Name {
        return this;
    }

    /** Printable → string with delimiter */
    public override asString(delimiter: string = this.delimiter): string {
        return this.name.split(this.delimiter).join(delimiter);
    }

    public override asDataString(): string {
        return this.asString(this.delimiter);
    }

    /** Value-based equality using final string form */
    public override isEqual(other: Name): boolean {
        if (this === other) return true;
        if (!other) return false;
        return this.asString(this.delimiter) === other.asString(this.delimiter);
    }

    /** Hash based on final string */
    public override getHashCode(): number {
        const s = this.asString(this.delimiter);
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    /** Empty when no components */
    public override isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public override getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public override getNoComponents(): number {
        return this.noComponents;
    }

    public override getComponent(i: number): string {
        const parts = this.name.split(this.delimiter);

        if (i < 0 || i >= parts.length)
            throw new Error("Index out of bounds");

        return parts[i];
    }

    /** Immutable modification: create new object */
    public override setComponent(i: number, c: string): Name {
        const parts = this.name.split(this.delimiter);

        if (i < 0 || i >= parts.length)
            throw new Error("Index out of bounds");

        parts[i] = c;
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public override insert(i: number, c: string): Name {
        const parts = this.name.split(this.delimiter);

        if (i < 0 || i > parts.length)
            throw new Error("Index out of bounds");

        parts.splice(i, 0, c);
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public override append(c: string): Name {
        const parts = this.name.split(this.delimiter);
        parts.push(c);
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public override remove(i: number): Name {
        const parts = this.name.split(this.delimiter);

        if (i < 0 || i >= parts.length)
            throw new Error("Index out of bounds");

        parts.splice(i, 1);
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    /** Immutable concat */
    public override concat(other: Name): Name {
        const myParts = this.name.split(this.delimiter);
        const otherParts = Array.from({ length: other.getNoComponents() },
            (_, i) => other.getComponent(i)
        );

        const merged = [...myParts, ...otherParts];

        return new StringName(merged.join(this.delimiter), this.delimiter);
    }
}
