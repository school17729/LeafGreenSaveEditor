import {UintEndianness} from "./UintEndianness.js";
import {Uint} from "./Uint.js";

class Uint8 extends Uint {

    public static SIZE: number = 1;
    public constructor(memory: number[], endianness: UintEndianness) {
        super(Uint8.SIZE, memory, endianness);
    }

    public static fromBinary(memory: number[], endianness: UintEndianness): Uint8 {
        return new Uint8(memory, endianness);
    }

    public static fromDecimal(value: number): Uint8 {
        return Uint8.toUint8(this.fromGenericDecimal(value));
    }

    private static toUint8(value: Uint): Uint8 {
        return new Uint8(value.getMemory(), value.getEndianness());
    }

    public add(other: Uint8): Uint8 {
        return Uint8.toUint8(this.addGeneric(other));
    }
}

export { Uint8 };