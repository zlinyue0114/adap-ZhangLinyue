import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype constructor
    constructor(source: string = "", delimiter: string = DEFAULT_DELIMITER) {
    this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    this.name = source ?? "";
    this.noComponents = this.splitMasked().length;
    }

    // @methodtype helper-method
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

    // @methodtype helper-method
    private static unmask(masked: string, delimiter: string): string {
        const esc = ESCAPE_CHARACTER;
        let out = "";
        for (let i = 0; i < masked.length; i++) {
            const ch = masked[i];
            if (ch === esc) {
                if (i + 1 < masked.length) { out += masked[i + 1]; i++; }
                else { out += esc; }
            }   else out += ch;
        }
        return out;
    }

    // @methodtype helper-method
    private splitMasked(): string[] {
        if (this.name === "") return [];
        const d = this.delimiter, esc = ESCAPE_CHARACTER;
        const parts: string[] = [];
        let cur = "";

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === esc) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else { cur += esc; }
            }   else if (ch === d) {
                parts.push(StringName.mask(StringName.unmask(cur, d), d));
                cur = "";
            }   else {
                cur += ch;
            }
        }
        parts.push(StringName.mask(StringName.unmask(cur, d), d));
        return parts;
    }
    
    // @methodtype helper-method
    private joinMasked(maskedParts: string[]): string {
        return maskedParts.join(this.delimiter);
    }

    // @methodtype helper-method
    private checkIndex(i: number, n: number, allowEnd = false) {
        const ok = allowEnd ? (i >= 0 && i <= n) : (i >= 0 && i < n);
        if (!ok) throw new RangeError(`Index ${i} out of bounds [0, ${allowEnd ? n : n - 1}]`);
    }

    // @methodtype helper-method
    private setFromMaskedParts(maskedParts: string[]) {
        this.name = this.joinMasked(maskedParts);
        this.noComponents = maskedParts.length;
    }

    // @methodtype get-method
    public asString(delimiter: string = this.delimiter): string {
        const rawParts = this.splitMasked().map(c => StringName.unmask(c, this.delimiter));
        return rawParts.join(delimiter);
    }

    // @methodtype get-method
    public asDataString(): string {
        const rawParts = this.splitMasked().map(c => StringName.unmask(c, this.delimiter));
        const remasked = rawParts.map(r => StringName.mask(r, DEFAULT_DELIMITER));
        return remasked.join(DEFAULT_DELIMITER);
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype get-method
    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(x: number): string {
        const parts = this.splitMasked();
        this.checkIndex(x, parts.length);
        return parts[x];
    }

    // @methodtype set-method
    public setComponent(n: number, c: string): void {
        const parts = this.splitMasked();
        this.checkIndex(n, parts.length);
        parts[n] = c;
        this.setFromMaskedParts(parts);
    }

    // @methodtype add-method
    public insert(n: number, c: string): void {
        const parts = this.splitMasked();
        this.checkIndex(n, parts.length, true);
        parts.splice(n, 0, c);
        this.setFromMaskedParts(parts);
    }

    // @methodtype add-method
    public append(c: string): void {
        const parts = this.splitMasked();
        parts.push(c);
        this.setFromMaskedParts(parts);
    }
    
    // @methodtype remove-method
    public remove(n: number): void {
        const parts = this.splitMasked();
        this.checkIndex(n, parts.length);
        parts.splice(n, 1);
        this.setFromMaskedParts(parts);
    }

    // @methodtype add-method
    public concat(other: Name): void {
        const parts = this.splitMasked();
        for (let k = 0; k < other.getNoComponents(); k++) {
        parts.push(other.getComponent(k));
        }
        this.setFromMaskedParts(parts);
    }   
}