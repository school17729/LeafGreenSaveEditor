import {Uint} from "./Uint.js";

class Uint8 extends Uint {

    public static SIZE: number = 1;
    public constructor() {
        super(Uint8.SIZE);
    }

    private static toUint8(value: Uint): Uint8 {
        const newUint8: Uint8 = new Uint8();
        newUint8.fromBinary(value.getMemory());
        return newUint8;
    }

    public add(other: Uint8): Uint8 {
        return Uint8.toUint8(this.addGeneric(other));
    }
}

export { Uint8 };