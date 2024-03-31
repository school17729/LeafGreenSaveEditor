import { UintType } from "./UintType.js";
import { UintEndianness } from "./UintEndianness.js";
import { Logic } from "./Logic.js";
class Uint16 {
    static SIZE = 2;
    type;
    endianness;
    memory;
    constructor(memory, endianness) {
        this.type = UintType.UINT_32;
        this.endianness = endianness;
        this.memory = memory;
    }
    static fromBinary(memory, endianness) {
        return new Uint16(memory, endianness);
    }
    static fromDecimal(value) {
        let binaryString = value.toString(2);
        const stringMemory = binaryString.split("");
        const memory = stringMemory.map((element) => parseInt(element));
        while (memory.length < this.SIZE * 8)
            memory.unshift(0);
        while (memory.length > this.SIZE * 8)
            memory.shift();
        return new Uint16(memory, UintEndianness.BIG);
    }
    getMemory() {
        return this.memory;
    }
    flipEndian() {
        const mem = [];
        for (let i = 0; i < Uint16.SIZE; i++) {
            for (let j = 0; j < 8; j++) {
                // (this.SIZE * 8) is the size in bits
                // - (8 * (i + 1)) is the negative offset in bits from the end of the memory array
                // j is the positive offset in bits from the negative offset
                mem.push(this.memory[(Uint16.SIZE * 8) - (8 * (i + 1)) + j]);
            }
        }
        return mem;
    }
    littleEndian() {
        if (this.endianness === UintEndianness.BIG)
            return this.flipEndian();
        return this.memory;
    }
    bigEndian() {
        if (this.endianness === UintEndianness.LITTLE)
            return this.flipEndian();
        return this.memory;
    }
    decimal() {
        const binaryString = this.bigEndian().join("");
        return parseInt(binaryString, 2);
    }
    littleEndianize() {
        this.memory = this.littleEndian();
        this.endianness = UintEndianness.LITTLE;
    }
    bigEndianize() {
        this.memory = this.bigEndian();
        this.endianness = UintEndianness.BIG;
    }
    add(other) {
        const sum = new Array(Uint16.SIZE * 8);
        let carry = false;
        const thisMemory = this.bigEndian();
        const otherMemory = other.bigEndian();
        const thisBooleanMemory = thisMemory.map((element) => Boolean(element));
        const otherBooleanMemory = otherMemory.map((element) => Boolean(element));
        for (let i = (Uint16.SIZE * 8) - 1; i >= 0; i--) {
            let node0 = thisBooleanMemory[i];
            let node1 = otherBooleanMemory[i];
            let node2 = carry;
            let node3 = Logic.xor(node0, node1);
            let node4 = Logic.xor(node3, node2); // sum
            let node5 = Logic.and(node0, node1);
            let node6 = Logic.and(node2, node3);
            let node7 = Logic.or(node5, node6); // carry
            sum[i] = Number(node4);
            carry = node7;
        }
        return new Uint16(sum, UintEndianness.BIG);
    }
}
export { Uint16 };
