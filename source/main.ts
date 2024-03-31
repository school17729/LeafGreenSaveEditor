import fs from "fs/promises";
import { Character } from "./Character.js";
import { Uint32 } from "./Uint/Uint32.js";
import { UintEndianness } from "./Uint/UintEndianness.js";
import { Uint16 } from "./Uint/Uint16.js";
import { Uint8 } from "./Uint/Uint8.js";

async function main(): Promise<void> {
    const sourceText: string = await fs.readFile("./sourceText.txt", "utf8");
    
    const sourceArray: number[] = JSON.parse("[" + sourceText + "]");

    const blockOffset: number = 1 * 57344; // 57344 bytes per block
    const sectionOffset: number = 1 * 4096; // 4096 bytes per section
    const totalSectionOffset: number = blockOffset + sectionOffset;
    
    const nameOffset: number = 0;
    const nameSize: number = 7;
    const checksumOffset: number = 4086;
    const checksumSize: number = 2;

    const targetString: string = "SHANNON\0";
    const targetArray: number[] = targetString.split("").map<number>((element: string): number => getEncodedNumFromStr(element));
    
    const nameArray: number[] = sourceArray.slice(totalSectionOffset + nameOffset, totalSectionOffset + nameOffset + nameSize);
    const nameString: string = nameArray.map<string>((element: number): string => getEncodedStrFromNum(element)).join("");

    const checksumArray: number[] = sourceArray.slice(totalSectionOffset + checksumOffset, totalSectionOffset + checksumOffset + checksumSize);
    const checksumString: string = checksumArray.map<string>((element: number): string => element.toString()).join(", ");

    const calculatedChecksum: number[] = calculateChecksum(sourceArray.slice(totalSectionOffset, totalSectionOffset + 3884));
    
    console.log("Calculated Checksum:", calculatedChecksum);
    console.log("Extracted Checksum:", checksumArray);
    console.log("Extracted Name:", nameString);

    const newSaveText: string = "";
}
main();

const characterEncoding: Character[] = [
    new Character("A", 187),
    new Character("B", 188),
    new Character("C", 189),
    new Character("D", 190),
    new Character("E", 191),
    new Character("F", 192),
    new Character("G", 193),
    new Character("H", 194),
    new Character("I", 195),
    new Character("J", 196),
    new Character("K", 197),
    new Character("L", 198),
    new Character("M", 199),
    new Character("N", 200),
    new Character("O", 201),
    new Character("P", 202),
    new Character("Q", 203),
    new Character("R", 204),
    new Character("S", 205),
    new Character("T", 206),
    new Character("U", 207),
    new Character("V", 208),
    new Character("W", 209),
    new Character("X", 210),
    new Character("Y", 211),
    new Character("Z", 212),
    new Character("\0", 255),
];

function getEncodedNumFromStr(str: string): number {
    for (let i: number = 0; i < characterEncoding.length; i++) {
        const character: Character = characterEncoding[i];

        if (character.getStr() === str)
            return character.getNum();
    }

    return -1;
}

function getEncodedStrFromNum(num: number): string {
    for (let i: number = 0; i < characterEncoding.length; i++) {
        const character: Character = characterEncoding[i];

        if (character.getNum() === num)
            return character.getStr();
    }

    return "";
}

function calculateChecksum(sectionMemory: number[]): number[] {
    let sum: Uint32 = Uint32.fromDecimal(0);

    for (let i: number = 0; i < sectionMemory.length; i += 4) {
        let read: number[] = [];
        for (let j: number = 0; j < 4; j++)
            read = read.concat(Uint8.fromDecimal(sectionMemory[i + j]).littleEndian());

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

function indexOfSubarray(sourceArray: number[], targetArray: number[]): number {
    for (let i: number = 0; i < 131072 - 8; i++) {
        let found: boolean = true;
        for (let j: number = 0; j < targetArray.length; j++) {
            if (sourceArray[i + j] != targetArray[j]) {
                found = false;
            }
        }

        if (found)
            return i;
    }

    return -1;
}