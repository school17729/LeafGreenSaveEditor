import {Editor} from "./Editor.js";
import {Uint32} from "./Uint/Uint32.js";
import {Uint8} from "./Uint/Uint8.js";
import {Uint16} from "./Uint/Uint16.js";

class ChecksumEditor extends Editor {
    public constructor(source: number[]) {
        super(source);
    }

    public calculateChecksum(): number[] {
        let sum: Uint32 = new Uint32();
        sum.fromDecimal(0);

        for (let i: number = 0; i < this.source.length; i += 4) {
            let read: number[] = [];
            for (let j: number = 0; j < 4; j++) {
                const readUint8: Uint8 = new Uint8();
                readUint8.fromDecimal(this.source[i + j]);
                read = read.concat(readUint8.getMemory());
            }

            const addAmount: Uint32 = new Uint32();
            addAmount.fromBinary(read);
            sum = sum.add(addAmount);
        }
        const lower: Uint16 = new Uint16();
        lower.fromBinary(sum.getMemory().slice(0, 16));
        const higher: Uint16 = new Uint16();
        higher.fromBinary(sum.getMemory().slice(16, 32));

        const rawChecksum: number[] = lower.add(higher).getMemory();
        const checksum: number[] = [];
        for (let i: number = 0; i < rawChecksum.length / 8; i++) {
            const decimalUint8: Uint8 = new Uint8();
            decimalUint8.fromBinary(rawChecksum.slice(i * 8, (i + 1) * 8));
            const decimalByte: number = decimalUint8.getDecimal();
            checksum.push(decimalByte);
        }

        return checksum;
    }
}

export {ChecksumEditor};