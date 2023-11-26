import type { TOTAL_TYPE_UNIT_NAMES } from "../interface/type"
import type { SchemaErrorStack } from "./schema.error.stack"

interface BaseCause {
    code: string
    message: string
}
export type CustomCause = { error_type: string; message: string } & Record<
    string,
    unknown
>
export type MetalCause = BaseCause | CustomCause

export interface ErrorConstructorOption {
    // eslint-disable-next-line @typescript-eslint/ban-types
    code: "VALIDATION" | "UNSUPPORTED" | "TRANSFORMATION" | (string & {})
    manager: SchemaErrorStack
    expectedType: TOTAL_TYPE_UNIT_NAMES
    // eslint-disable-next-line @typescript-eslint/ban-types
    startStack?: Function | undefined
}

export class MetalError extends Error {
    constructor({
        code,
        expectedType,
        startStack,
        manager,
    }: ErrorConstructorOption) {
        const message = manager.messages

        super(message)

        this.name = `${code}`
        this.errorTitle = `${MetalError.addMessagePrefix(code)}${message}`
        this.expectedType = expectedType

        // base cause
        this.addCause([
            {
                code: "VALIDATION",
                error_type: code,
                message: this.errorTitle,
            },
        ])
        // custom cause
        this.addCause(manager.stack)

        Error.captureStackTrace(this, startStack ?? MetalError)
    }

    public override readonly name: string

    private errorTitle: string
    public override get message(): string {
        return this.specification
    }

    public readonly expectedType: TOTAL_TYPE_UNIT_NAMES

    private static addMessagePrefix = (code: string): string => {
        const capitalizedCode = `${code.charAt(0)}${code
            .slice(1)
            .toLowerCase()}`
        return `${capitalizedCode} error occurred, `
    }

    private _cause: Array<CustomCause | BaseCause> = []
    public override get cause(): Array<CustomCause | BaseCause> {
        return this._cause
    }
    private addCause(causes: Array<CustomCause | BaseCause>): void {
        causes?.forEach((cause) => {
            this._cause.push(cause)
        })
    }

    private formatCause(cause: BaseCause | CustomCause): string {
        return Object.entries(cause)
            .map(([key, value]) => `► ${key}: ${JSON.stringify(value)}`)
            .join("\n")
    }

    /**
     * @description Get the specification of the error message and causes.
     */
    public get specification(): string {
        if (this._cause === undefined || this._cause.length === 0)
            return this.errorTitle

        return this._cause?.map((cause) => this.formatCause(cause)).join("\n")
    }

    public static formatTypeError(
        type: string,
        givenValue: unknown,
        additionalMessage?: string
    ): string {
        return `Expected type ${type}, but received ${typeof givenValue} - ${JSON.stringify(
            givenValue
        )}${additionalMessage ? `\n${additionalMessage}` : ""}`
    }
}