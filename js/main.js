import fs from "fs/promises";
import { Character } from "./Character.js";
import { Uint32 } from "./Uint/Uint32.js";
import { UintEndianness } from "./Uint/UintEndianness.js";
import { Uint16 } from "./Uint/Uint16.js";
import { Uint8 } from "./Uint/Uint8.js";
async function main() {
    const sourceText = await fs.readFile("./sourceText.txt", "utf8");
    const sourceArray = JSON.parse("[" + sourceText + "]");
    const blockOffset = 1 * 57344; // 57344 bytes per block
    const sectionOffset = 1 * 4096; // 4096 bytes per section
    const totalSectionOffset = blockOffset + sectionOffset;
    const nameOffset = 0;
    const nameSize = 7;
    const checksumOffset = 4086;
    const checksumSize = 2;
    const targetString = "SHANNON\0";
    const targetArray = targetString.split("").map((element) => getEncodedNumFromStr(element));
    const nameArray = sourceArray.slice(totalSectionOffset + nameOffset, totalSectionOffset + nameOffset + nameSize);
    const nameString = nameArray.map((element) => getEncodedStrFromNum(element)).join("");
    const checksumArray = sourceArray.slice(totalSectionOffset + checksumOffset, totalSectionOffset + checksumOffset + checksumSize);
    const checksumString = checksumArray.map((element) => element.toString()).join(", ");
    const extractedChecksum = calculateChecksum(sourceArray.slice(totalSectionOffset, totalSectionOffset + 3884));
    console.log("Extracted Checksum:", extractedChecksum);
    console.log("Extracted Name:", nameString);
    const newSaveText = "";
}
main();
const characterEncoding = [
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
function getEncodedNumFromStr(str) {
    for (let i = 0; i < characterEncoding.length; i++) {
        const character = characterEncoding[i];
        if (character.getStr() === str)
            return character.getNum();
    }
    return -1;
}
function getEncodedStrFromNum(num) {
    for (let i = 0; i < characterEncoding.length; i++) {
        const character = characterEncoding[i];
        if (character.getNum() === num)
            return character.getStr();
    }
    return "";
}
function calculateChecksum(sectionMemory) {
    let sum = Uint32.fromDecimal(0);
    for (let i = 0; i < sectionMemory.length; i += 4) {
        let read = [];
        for (let j = 0; j < 4; j++)
            read = read.concat(Uint8.fromDecimal(sectionMemory[i + j]).littleEndian());
        sum = sum.add(Uint32.fromBinary(read, UintEndianness.LITTLE));
    }
    const lower = Uint16.fromBinary(sum.littleEndian().slice(0, 16), UintEndianness.LITTLE);
    const higher = Uint16.fromBinary(sum.littleEndian().slice(16, 32), UintEndianness.LITTLE);
    const rawChecksum = lower.add(higher).littleEndian();
    const checksum = [];
    for (let i = 0; i < rawChecksum.length / 8; i++) {
        const decimalByte = Uint8.fromBinary(rawChecksum.slice(i * 8, (i + 1) * 8), UintEndianness.LITTLE).decimal();
        checksum.push(decimalByte);
    }
    return checksum;
}
function indexOfSubarray(sourceArray, targetArray) {
    for (let i = 0; i < 131072 - 8; i++) {
        let found = true;
        for (let j = 0; j < targetArray.length; j++) {
            if (sourceArray[i + j] != targetArray[j]) {
                found = false;
            }
        }
        if (found)
            return i;
    }
    return -1;
}
