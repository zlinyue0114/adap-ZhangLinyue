export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

     /** escape delimiter & ESCAPE in a raw component */
    private static mask(raw: string, delimiter: string): string {
    const esc = ESCAPE_CHARACTER;
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === esc || ch === delimiter) out += esc;
      out += ch;
    }
    return out;
    }
    /** unescape a masked component with respect to delimiter */
    private static unmask(masked: string, delimiter: string): string {
    const esc = ESCAPE_CHARACTER;
    let out = '';
    for (let i = 0; i < masked.length; i++) {
      const ch = masked[i];
      if (ch === esc) {
        // take next char verbatim if exists
        if (i + 1 < masked.length) {
          out += masked[i + 1];
          i++;
        } else {
          // trailing ESCAPE => keep as literal ESCAPE
          out += esc;
        }
      } else {
        out += ch;
      }
    }
    return out;
    }

    private checkIndex(i: number, allowEnd = false) {
    const n = this.components.length;
    const ok = allowEnd ? (i >= 0 && i <= n) : (i >= 0 && i < n);
    if (!ok) throw new RangeError(`Index ${i} out of bounds [0, ${allowEnd ? n : n - 1}]`);
   }

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
    if (!Array.isArray(other)) throw new TypeError('other must be string[]');
    this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    // store *as is* (masked w.r.t. this.delimiter)
    this.components = other.slice();
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
    const raw = this.components.map(c => Name.unmask(c, this.delimiter));
    return raw.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
    const raw = this.components.map(c => Name.unmask(c, this.delimiter));
    const remasked = raw.map(r => Name.mask(r, DEFAULT_DELIMITER));
    return remasked.join(DEFAULT_DELIMITER);;
    }

    /** Returns properly masked component string */
    public getComponent(i: number): string {
    this.checkIndex(i);
    return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
    this.checkIndex(i);
    this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
    return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
    this.checkIndex(i, /*allowEnd*/ true);
    this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
    this.components.push(c);
    }

    public remove(i: number): void {
    this.checkIndex(i);
    this.components.splice(i, 1);
    }

}
