import { describe, expect, it } from "vitest"
import { t } from "../index"
import { label } from "./utils/test.label"

describe(label.unit("MetalType - PrimitivesSchema"), () => {
    it(label.case("should parse string -> strict"), () => {
        const parsed = t.string.parse("hello")
        expect(parsed).toEqual("hello")
    })

    it(label.case("should parse number -> strict"), () => {
        const parsed = t.number.parse(1)
        expect(parsed).toEqual(1)
    })

    it(label.case("should parse boolean -> strict"), () => {
        const parsed = t.boolean.parse(true)
        expect(parsed).toEqual(true)
    })

    it(label.case("should parse symbol -> strict"), () => {
        const testSymbol = Symbol("hello")
        const parsed = t.symbol.parse(testSymbol)
        expect(parsed).toEqual(testSymbol)
    })

    it(label.case("should parse undefined -> strict"), () => {
        const parsed = t.undefined.parse(undefined)
        expect(parsed).toEqual(undefined)
    })

    it(label.case("should parse null -> strict"), () => {
        const parsed = t.null.parse(null)
        expect(parsed).toEqual(null)
    })

    it(label.case("should parse any -> strict"), () => {
        const parsed = t.any.parse("hello")
        const parsed2 = t.any.parse(1)
        const parsed3 = t.any.parse(true)

        expect(parsed).toEqual("hello")
        expect(parsed2).toEqual(1)
        expect(parsed3).toEqual(true)
    })

    it(label.case("should parse unknown -> strict"), () => {
        const parsed = t.unknown.parse("hello")
        expect(parsed).toEqual("hello")
    })

    it(label.case("should parse literal -> strict"), () => {
        const parsed = t.literal("hello").parse("hello")
        expect(parsed).toEqual("hello")

        const parsed2 = t.literal(1).parse(1)
        expect(parsed2).toEqual(1)

        const parsed3 = t.literal(true).parse(true)
        expect(parsed3).toEqual(true)
    })

    it(label.case("should parse never -> strict"), () => {
        expect(() => t.never.parse("hello")).toThrowError("")
    })

    it(label.case("should parse nullish -> strict"), () => {
        const nullishString = t.string.nullish()
        const parsed = nullishString.parse("hello")
        const parsed2 = nullishString.parse(null)
        expect(parsed).toEqual("hello")
        expect(parsed2).toEqual(null)
    })

    it(label.case("should parse nullable -> strict"), () => {
        const nullableString = t.string.nullable()
        const parsed = nullableString.parse("hello")
        const parsed2 = nullableString.parse(null)
        expect(parsed).toEqual("hello")
        expect(parsed2).toEqual(null)
    })

    it(label.case("should parse optional -> strict"), () => {
        const optionalString = t.string.optional()
        const optionalNumber = t.number.optional()
        const parsed = optionalString.parse("hello")
        const parsed2 = optionalString.parse(undefined)
        const parsed3 = optionalNumber.parse(1)
        const parsed4 = optionalNumber.parse(undefined)
        expect(parsed).toEqual("hello")
        expect(parsed2).toEqual(undefined)
        expect(parsed3).toEqual(1)
        expect(parsed4).toEqual(undefined)
    })
})
