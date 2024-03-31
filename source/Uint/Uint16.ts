import {UintEndianness} from "./UintEndianness.js";
import {Uint} from "./Uint.js";

class Uint16 extends Uint {

    public static SIZE: number = 1;
    public constructor(memory: number[], endianness: UintEndianness) {
        super(Uint16.SIZE, memory, endianness);
    }

    public static fromBinary(memory: number[], endianness: UintEndianness): Uint16 {
        return new Uint16(memory, endianness);
    }

    public static fromDecimal(value: number): Uint16 {
        return Uint16.toUint16(this.fromGenericDecimal(value));
    }

    private static toUint16(value: Uint): Uint16 {
        return new Uint16(value.getMemory(), value.getEndianness());
    }

    public add(other: Uint16): Uint16 {
        return Uint16.toUint16(this.addGeneric(other));
    }
}

export { Uint16 };