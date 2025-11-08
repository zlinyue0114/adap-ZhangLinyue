import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];
    
    // @methodtype constructor
    constructor(source: string[] = [], delimiter: string = DEFAULT_DELIMITER) {
    if (!Array.isArray(source)) throw new TypeError("source must be string[]");
    this.delimiter = delimiter;
    this.components = source.slice();
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
      } else out += ch;
    }
    return out;
    }

    // @methodtype helper-method
    private checkIndex(i: number, allowEnd = false) {
    const n = this.components.length;
    const ok = allowEnd ? (i >= 0 && i <= n) : (i >= 0 && i < n);
    if (!ok) throw new RangeError(`Index ${i} out of bounds [0, ${allowEnd ? n : n - 1}]`);
    }
    // @methodtype get-method
    public asString(delimiter: string = this.delimiter): string {
    const raw = this.components.map(c => StringArrayName.unmask(c, this.delimiter));
    return raw.join(delimiter);
    }
    // @methodtype get-method
    public asDataString(): string {
    const raw = this.components.map(c => StringArrayName.unmask(c, this.delimiter));
    const remasked = raw.map(r => StringArrayName.mask(r, DEFAULT_DELIMITER));
    return remasked.join(DEFAULT_DELIMITER);
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
    return this.delimiter;
    }

    // @methodtype get-method
    public isEmpty(): boolean {
    return this.components.length === 0;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }
    
    // @methodtype get-method
    public getComponent(i: number): string {
        self: this.checkIndex(i);
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.checkIndex(i);
        this.components[i] = c;
    }

    // @methodtype add-method
    public insert(i: number, c: string): void {
        this.checkIndex(i, true);
        this.components.splice(i, 0, c);
    }

    // @methodtype add-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype remove-method
    public remove(i: number): void {
        this.checkIndex(i);
        this.components.splice(i, 1);
    }

    // @methodtype add-method
    public concat(other: Name): void {
        for (let k = 0; k < other.getNoComponents(); k++) {
        this.components.push(other.getComponent(k));
        }
    }
}