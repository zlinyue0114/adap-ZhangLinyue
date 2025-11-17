import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source ?? "";
        this.noComponents = this.splitMasked().length;
    }

    protected createEmptyWithDelimiter(del: string): StringName {
        return new StringName("", del);
    }

    private static mask(raw: string, delimiter: string): string {
        const esc = ESCAPE_CHARACTER;
        let out = "";
        for (let i = 0; i < raw.length; i++) {
            const ch = raw[i];
            if (ch === esc || ch === delimiter) out += esc;
            out += ch;
        }
        return out;
    }

    private static unmask(masked: string, delimiter: string): string {
        const esc = ESCAPE_CHARACTER;
        let out = "";
        for (let i = 0; i < masked.length; i++) {
            const ch = masked[i];
            if (ch === esc) {
                if (i + 1 < masked.length) { out += masked[i + 1]; i++; }
                else out += esc;
            } else out += ch;
        }
        return out;
    }

    private splitMasked(): string[] {
        if (this.name === "") return [];
        const d = this.delimiter, esc = ESCAPE_CHARACTER;
        const parts: string[] = [];
        let cur = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === esc) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else cur += esc;
            } else if (ch === d) {
                parts.push(StringName.mask(StringName.unmask(cur, d), d));
                cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(StringName.mask(StringName.unmask(cur, d), d));
        return parts;
    }

    private joinMasked(maskedParts: string[]): string {
        return maskedParts.join(this.delimiter);
    }

    private checkIndex(i: number, n: number, allowEnd = false) {
        const ok = allowEnd ? (i >= 0 && i <= n) : (i >= 0 && i < n);
        if (!ok) throw new RangeError(`Index ${i} out of bounds`);
    }

    private setFromMaskedParts(masked: string[]) {
        this.name = this.joinMasked(masked);
        this.noComponents = masked.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const raw = this.splitMasked().map(c => StringName.unmask(c, this.delimiter));
        return raw.join(delimiter);
    }

    public asDataString(): string {
        const raw = this.splitMasked().map(c => StringName.unmask(c, this.delimiter));
        const remasked = raw.map(r => StringName.mask(r, DEFAULT_DELIMITER));
        return remasked.join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const parts = this.splitMasked();
        this.checkIndex(i, parts.length);
        return parts[i];
    }

    public setComponent(i: number, c: string): void {
        const parts = this.splitMasked();
        this.checkIndex(i, parts.length);
        parts[i] = c;
        this.setFromMaskedParts(parts);
    }

    public insert(i: number, c: string): void {
        const parts = this.splitMasked();
        this.checkIndex(i, parts.length, true);
        parts.splice(i, 0, c);
        this.setFromMaskedParts(parts);
    }

    public append(c: string): void {
        const parts = this.splitMasked();
        parts.push(c);
        this.setFromMaskedParts(parts);
    }

    public remove(i: number): void {
        const parts = this.splitMasked();
        this.checkIndex(i, parts.length);
        parts.splice(i, 1);
        this.setFromMaskedParts(parts);
    }
}