import {Editor} from "./Editor.js";
import {Uint32} from "./Uint/Uint32.js";
import {Uint8} from "./Uint/Uint8.js";
import {UintEndianness} from "./Uint/UintEndianness.js";
import {Uint16} from "./Uint/Uint16.js";

class ChecksumEditor extends Editor {
    public constructor(source: number[]) {
        super(source);
    }

    public calculateChecksum(): number[] {
        let sum: Uint32 = Uint32.fromDecimal(0);

        for (let i: number = 0; i < this.source.length; i += 4) {
            let read: number[] = [];
            for (let j: number = 0; j < 4; j++)
                read = read.concat(Uint8.fromDecimal(this.source[i + j]).littleEndian());

            sum = sum.add(Uint32.fromBinary(read, UintEndianness.LITTLE));
        }

        const lower: Uint16 = Uint16.fromBinary(sum.littleEndian().slice(0, 16), UintEndianness.LITTLE);
        const higher: Uint16 = Uint16.fromBinary(sum.littleEndian().slice(16, 32), UintEndianness.LITTLE);

        const rawChecksum: number[] = lower.add(higher).littleEndian();
        const checksum: number[] = [];
        for (let i: number = 0; i < rawChecksum.length / 8; i++) {
            const decimalByte: number = Uint8.fromBinary(rawChecksum.slice(i * 8, (i + 1) * 8), UintEndianness.LITTLE).decimal();
            checksum.push(decimalByte);
        }

        return checksum;
    }
}

export {ChecksumEditor};