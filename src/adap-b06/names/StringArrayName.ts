import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { DEFAULT_DELIMITER } from "../common/Printable";

/**
 * Immutable Name implementation backed by a string array.
 */
export class StringArrayName extends AbstractName {

    private readonly components: readonly string[];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        // Copy to enforce immutability
        this.components = [...source];
    }

    /** Immutable clone — may return this */
    public override clone(): Name {
        return this; 
    }

    /** Return delimiter-separated string */
    public override asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public override asDataString(): string {
        return this.asString(this.delimiter);
    }

    /** Value-based equality */
    public override isEqual(other: Name): boolean {
        if (this === other) return true;
        if (!other) return false;
        return this.asString(this.delimiter) === other.asString(this.delimiter);
    }

    /** Hash based on string representation */
    public override getHashCode(): number {
        const s = this.asString(this.delimiter);
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    public override isEmpty(): boolean {
        return this.components.length === 0;
    }

    public override getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public override getNoComponents(): number {
        return this.components.length;
    }

    public override getComponent(i: number): string {
        if (i < 0 || i >= this.components.length)
            throw new Error("Index out of bounds");
        return this.components[i];
    }

    /** Immutable: return new instance with updated component */
    public override setComponent(i: number, c: string): Name {
        if (i < 0 || i >= this.components.length)
            throw new Error("Index out of bounds");

        const newArr = [...this.components];
        newArr[i] = c;
        return new StringArrayName(newArr, this.delimiter);
    }

    /** Immutable insert */
    public override insert(i: number, c: string): Name {
        if (i < 0 || i > this.components.length)
            throw new Error("Index out of bounds");

        const newArr = [...this.components];
        newArr.splice(i, 0, c);
        return new StringArrayName(newArr, this.delimiter);
    }

    /** Immutable append */
    public override append(c: string): Name {
        const newArr = [...this.components, c];
        return new StringArrayName(newArr, this.delimiter);
    }

    /** Immutable remove */
    public override remove(i: number): Name {
        if (i < 0 || i >= this.components.length)
            throw new Error("Index out of bounds");

        const newArr = [...this.components];
        newArr.splice(i, 1);
        return new StringArrayName(newArr, this.delimiter);
    }

    /** Immutable concat */
    public override concat(other: Name): Name {
        const otherArr = Array.from({ length: other.getNoComponents() },
            (_, i) => other.getComponent(i)
        );

        const newArr = [...this.components, ...otherArr];
        return new StringArrayName(newArr, this.delimiter);
    }
}
