import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        if (!Array.isArray(source)) {
            throw new Error("source must be a string[]");
        }
        this.components = source.slice();
        this.assertClassInvariants();
    }

    public clone(): Name {
        const cloned = this.createEmptyWithDelimiter(this.delimiter);
        for (let i = 0; i < this.components.length; i++) {
            cloned.append(this.components[i]);
        }
        return cloned;
    }

    public asString(delimiter: string = this.delimiter): string {
       return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return super.getComponent(i);
    }

    public setComponent(i: number, c: string) {
        super.setComponent(i, c);
    }

    public insert(i: number, c: string) {
        super.insert(i, c);
    }

    public append(c: string) {
        super.append(c);
    }

    public remove(i: number) {
        super.remove(i);
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    protected createEmptyWithDelimiter(del: string): AbstractName {
        return new StringArrayName([], del);
    }

    protected doGetComponent(i: number): string {
        return this.components[i];
    }

    protected doSetComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    protected doInsert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    protected doAppend(c: string): void {
        this.components.push(c);
    }

    protected doRemove(i: number): void {
        this.components.splice(i, 1);
    }
}