import { IllegalArgumentException } from "./IllegalArgumentException";
import { MethodFailedException } from "./MethodFailedException";
import { InvalidStateException } from "./InvalidStateException";

/**
 * The three possible categories of contract violations.
 */
export enum ExceptionType {
    PRECONDITION,
    POSTCONDITION,
    CLASS_INVARIANT
}

/**
 * AssertionDispatcher:
 *  - central contract violation handler for Design-by-Contract (DbC)
 *  - throws the correct exception type depending on contract category
 *
 * dispatch(et, condition, message):
 *  - et: ExceptionType enum
 *  - condition: boolean, if TRUE => contract violation => throw
 *  - message: error message to be used inside the exception
 */
export class AssertionDispatcher {

    public static dispatch(
        et: ExceptionType,
        condition: boolean,
        message: string
    ): void {

        if (!condition) return;  // everything OK

        switch (et) {

            case ExceptionType.PRECONDITION:
                throw new IllegalArgumentException(
                    "Precondition violated: " + message
                );

            case ExceptionType.POSTCONDITION:
                throw new MethodFailedException(
                    "Postcondition violated: " + message
                );

            case ExceptionType.CLASS_INVARIANT:
                throw new InvalidStateException(
                    "Class invariant violated: " + message
                );

            default:
                throw new Error("Unknown ExceptionType in AssertionDispatcher");
        }
    }
}
