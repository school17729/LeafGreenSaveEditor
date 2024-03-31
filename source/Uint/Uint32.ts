import { UintType } from "./UintType.js";
import { UintEndianness } from "./UintEndianness.js";
import { Logic } from "./Logic.js";

class Uint32 {

    private static SIZE: number = 4;
    private type: UintType;
    private endianness: UintEndianness;
    private memory: number[];

    private constructor(memory: number[], endianness: UintEndianness) {
        this.type = UintType.UINT_32;
        this.endianness = endianness;
        this.memory = memory;
    }

    public static fromBinary(memory: number[], endianness: UintEndianness): Uint32 {
        return new Uint32(memory, endianness);
    }

    public static fromDecimal(value: number): Uint32 {
        let binaryString: string = value.toString(2);
        const stringMemory: string[] = binaryString.split("");

        const memory: number[] = stringMemory.map<number>((element: string): number => parseInt(element));

        while (memory.length < this.SIZE * 8)
            memory.unshift(0);
        while (memory.length > this.SIZE * 8)
            memory.shift();
        
        return new Uint32(memory, UintEndianness.BIG);
    }

    public getMemory(): number[] {
        return this.memory;
    }

    public flipEndian(): number[] {
        const mem: number[] = [];
        for (let i: number = 0; i < Uint32.SIZE; i++) {
            for (let j: number = 0; j < 8; j++) {
                // (this.SIZE * 8) is the size in bits
                // - (8 * (i + 1)) is the negative offset in bits from the end of the memory array
                // j is the positive offset in bits from the negative offset

                mem.push(this.memory[(Uint32.SIZE * 8) - (8 * (i + 1)) + j]);
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

    public littleEndianize(): void {
        this.memory = this.littleEndian();
        this.endianness = UintEndianness.LITTLE;
    }

    public bigEndianize(): void {
        this.memory = this.bigEndian();
        this.endianness = UintEndianness.BIG;
    }

    public add(other: Uint32): Uint32 {
        const sum: number[] = new Array<number>(Uint32.SIZE * 8);
        let carry: boolean = false;

        const thisMemory: number[] = this.bigEndian();
        const otherMemory: number[] = other.bigEndian();

        const thisBooleanMemory: boolean[] = thisMemory.map<boolean>((element: number): boolean => Boolean(element));
        const otherBooleanMemory: boolean[] = otherMemory.map<boolean>((element: number): boolean => Boolean(element));

        for (let i: number = (Uint32.SIZE * 8) - 1; i >= 0; i--) {
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

        return new Uint32(sum, UintEndianness.BIG);
    }
}

export { Uint32 };