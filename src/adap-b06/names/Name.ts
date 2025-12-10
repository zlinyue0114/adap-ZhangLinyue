import { Printable } from "../common/Printable";
import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";

/**
 * A Name is an immutable value type representing a sequence of components.
 * All modifying operations return a NEW Name instance.
 */
export interface Name extends Printable, Equality, Cloneable {

    /** Number of components in this Name */
    getNoComponents(): number;

    /** Return the component at index i */
    getComponent(i: number): string;

    /** Return true if the Name has no components */
    isEmpty(): boolean;

    /** Produce a NEW Name with an additional component appended */
    append(c: string): Name;

    /** Produce a NEW Name inserting a component at index i */
    insert(i: number, c: string): Name;

    /** Produce a NEW Name with component i replaced */
    setComponent(i: number, c: string): Name;

    /** Produce a NEW Name with component i removed */
    remove(i: number): Name;

    /** Concatenate two Names → returns a NEW Name */
    concat(other: Name): Name;

    /** String representation using the delimiter */
    asString(delimiter?: string): string;

    /** Deep clone (because immutable, clone may return this) */
    clone(): Name;
}
