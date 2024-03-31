import {Uint} from "./Uint.js";

class Uint16 extends Uint {

    public static SIZE: number = 2;
    public constructor() {
        super(Uint16.SIZE);
    }

    private static toUint16(value: Uint): Uint16 {
        const newUint16: Uint16 = new Uint16();
        newUint16.fromBinary(value.getMemory());
        return newUint16;
    }

    public add(other: Uint16): Uint16 {
        return Uint16.toUint16(this.addGeneric(other));
    }
}

export { Uint16 };