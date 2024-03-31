import {Uint} from "./Uint.js";

class Uint32 extends Uint {

    public static SIZE: number = 4;
    public constructor() {
        super(Uint32.SIZE);
    }

    private static toUint32(value: Uint): Uint32 {
        const newUint32: Uint32 = new Uint32();
        newUint32.fromBinary(value.getMemory());
        return newUint32;
    }

    public add(other: Uint32): Uint32 {
        return Uint32.toUint32(this.addGeneric(other));
    }
}

export { Uint32 };