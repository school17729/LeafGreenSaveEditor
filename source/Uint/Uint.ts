import {UintEndianness} from "./UintEndianness.js";
import {Logic} from "./Logic.js";

class Uint {

    public static SIZE: number;
    protected size: number;
    protected endianness: UintEndianness;
    protected memory: number[];

    protected constructor(size: number, memory: number[], endianness: UintEndianness) {
        this.size = size;
        this.endianness = endianness;
        this.memory = memory;
    }

    protected static fromGenericDecimal(value: number): Uint {
        let binaryString: string = value.toString(2);
        const stringMemory: string[] = binaryString.split("");

        const memory: number[] = stringMemory.map<number>((element: string): number => parseInt(element));

        while (memory.length < this.SIZE * 8)
            memory.unshift(0);
        while (memory.length > this.SIZE * 8)
            memory.shift();

        return new Uint(this.SIZE, memory, UintEndianness.BIG);
    }

    public flipEndian(): number[] {
        const mem: number[] = [];
        for (let i: number = 0; i < this.size; i++) {
            for (let j: number = 0; j < 8; j++) {
                // (this.SIZE * 8) is the size in bits
                // - (8 * (i + 1)) is the negative offset in bits from the end of the memory array
                // j is the positive offset in bits from the negative offset

                mem.push(this.memory[(this.size * 8) - (8 * (i + 1)) + j]);
            }
        }
        return mem;
    }

    public littleEndian(): number[] {
        if (this.endianness === UintEndianness.BIG)
            return this.flipEndian();

        return this.memory;
    }

    public bigEndian(): number[] {
        if (this.endianness === UintEndianness.LITTLE)
            return this.flipEndian();

        return this.memory;
    }

    public decimal(): number {
        const binaryString: string = this.bigEndian().join("");
        return parseInt(binaryString, 2);
    }

    public addGeneric(other: Uint): Uint {
        const sum: number[] = new Array<number>(this.size * 8);
        let carry: boolean = false;

        const thisMemory: number[] = this.bigEndian();
        const otherMemory: number[] = other.bigEndian();

        const thisBooleanMemory: boolean[] = thisMemory.map<boolean>((element: number): boolean => Boolean(element));
        const otherBooleanMemory: boolean[] = otherMemory.map<boolean>((element: number): boolean => Boolean(element));

        for (let i: number = (this.size * 8) - 1; i >= 0; i--) {
            let node0: boolean = thisBooleanMemory[i];
            let node1: boolean = otherBooleanMemory[i];
            let node2: boolean = carry;
            let node3: boolean = Logic.xor(node0, node1);
            let node4: boolean = Logic.xor(node3, node2); // sum
            let node5: boolean = Logic.and(node0, node1);
            let node6: boolean = Logic.and(node2, node3);
            let node7: boolean = Logic.or(node5, node6); // carry
            sum[i] = Number(node4);
            carry = node7;
        }

        return new Uint(this.size, sum, UintEndianness.BIG);
    }

    public getMemory(): number[] {
        return this.memory;
    }

    public getEndianness(): UintEndianness {
        return this.endianness;
    }
}

export {Uint};