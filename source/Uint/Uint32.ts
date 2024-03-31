import {UintEndianness} from "./UintEndianness.js";
import {Uint} from "./Uint.js";

class Uint32 extends Uint {

    public static SIZE: number = 1;
    public constructor(memory: number[], endianness: UintEndianness) {
        super(Uint32.SIZE, memory, endianness);
    }

    public static fromBinary(memory: number[], endianness: UintEndianness): Uint32 {
        return new Uint32(memory, endianness);
    }

    public static fromDecimal(value: number): Uint32 {
        return Uint32.toUint32(this.fromGenericDecimal(value));
    }

    private static toUint32(value: Uint): Uint32 {
        return new Uint32(value.getMemory(), value.getEndianness());
    }

    public add(other: Uint32): Uint32 {
        return Uint32.toUint32(this.addGeneric(other));
    }
}

export { Uint32 };