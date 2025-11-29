import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.name = source ?? "";
        this.noComponents = this.splitMasked().length;
        this.assertClassInvariants();
    }

    public clone(): Name {
        const cloned = this.createEmptyWithDelimiter(this.delimiter);
        const parts = this.splitMasked();
        for (const part of parts) cloned.append(part);
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
        return this.noComponents === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
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

    protected createEmptyWithDelimiter(delimiter: string): AbstractName {
        return new StringName("", delimiter);
    }

    protected doGetComponent(i: number): string {
        const parts = this.splitMasked();
        return parts[i];
    }

    protected doSetComponent(i: number, c: string): void {
        const parts = this.splitMasked();
        parts[i] = c;
        this.setFromMaskedParts(parts);
    }

    protected doInsert(i: number, c: string): void {
        const parts = this.splitMasked();
        parts.splice(i, 0, c);
        this.setFromMaskedParts(parts);
    }

    protected doAppend(c: string): void {
        const parts = this.splitMasked();
        parts.push(c);
        this.setFromMaskedParts(parts);
    }

    protected doRemove(i: number): void {
        const parts = this.splitMasked();
        parts.splice(i, 1);
        this.setFromMaskedParts(parts);
    }

    private splitMasked(): string[] {
        if (this.name === "") return [];

        const d = this.delimiter;
        const esc = ESCAPE_CHARACTER;

        const parts: string[] = [];
        let cur = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === esc) {
                if (i + 1 < this.name.length) {
                    cur += this.name[i + 1];
                    i++;
                } else {
                    cur += esc;
                }
            } else if (ch === d) {
                const masked = this.mask(this.unmask(cur), d);
                parts.push(masked);
                cur = "";
            } else {
                cur += ch;
            }
        }
        const finalMasked = this.mask(this.unmask(cur), d);
        parts.push(finalMasked);

        return parts;
    }

    private joinMasked(parts: string[]): string {
        return parts.join(this.delimiter);
    }

    private setFromMaskedParts(masked: string[]): void {
        this.name = this.joinMasked(masked);
        this.noComponents = masked.length;

        // enforce invariants after mutation
        this.assertClassInvariants();
    }
}