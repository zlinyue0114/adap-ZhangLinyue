import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        if (!Array.isArray(source)) throw new TypeError("source must be string[]");
        this.components = source.slice();
    }

    protected createEmptyWithDelimiter(delimiter: string): StringArrayName {
        return new StringArrayName([], delimiter);
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

    private checkIndex(i: number, allowEnd = false) {
        const n = this.components.length;
        const ok = allowEnd ? (i >= 0 && i <= n) : (i >= 0 && i < n);
        if (!ok) throw new RangeError(`Index ${i} out of bounds`);
    }

    public asString(delimiter: string = this.delimiter): string {
        const raw = this.components.map(c => StringArrayName.unmask(c, this.delimiter));
        return raw.join(delimiter);
    }
    public asDataString(): string {
        const raw = this.components.map(c => StringArrayName.unmask(c, this.delimiter));
        const remasked = raw.map(r => StringArrayName.mask(r, DEFAULT_DELIMITER));
        return remasked.join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.checkIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.checkIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.checkIndex(i, true);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.checkIndex(i);
        this.components.splice(i, 1);
    }
}