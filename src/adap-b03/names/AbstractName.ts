import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        // simple but valid hash combining components
        let hash = 17;
        for (let i = 0; i < this.getNoComponents(); i++) {
            const comp = this.getComponent(i);
            for (let j = 0; j < comp.length; j++) {
                hash = hash * 31 + comp.charCodeAt(j);
            }
        }
        return hash;
    }

    public clone(): Name {
        const cloned = this.createEmptyWithDelimiter(this.delimiter);
        for (let i = 0; i < this.getNoComponents(); i++) {
            cloned.append(this.getComponent(i));
        }
        return cloned;
    }

    protected abstract createEmptyWithDelimiter(delimiter: string): AbstractName;

    abstract asString(del: string): string;
    abstract asDataString(): string;

    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

}