import { SaveBlock } from "./SaveBlock";
import { SectionContent } from "./SectionContent";
import { Extractor } from "./Extractor";
class SectionContentExtractor extends Extractor {
    BLOCK_SIZE = 57344;
    SECTION_SIZE = 4096;
    blockOffsets = new Map([
        [SaveBlock.A, 0],
        [SaveBlock.B, this.BLOCK_SIZE]
    ]);
    sectionContentOffsets = new Map([
        [SectionContent.DATA, 0],
        [SectionContent.SECTION_ID, 3968],
        [SectionContent.CHECKSUM, 3970],
        [SectionContent.SIGNATURE, 3972],
        [SectionContent.SAVE_INDEX, 3976],
    ]);
    sectionContentSizes = new Map([
        [SectionContent.DATA, 3968],
        [SectionContent.SECTION_ID, 2],
        [SectionContent.CHECKSUM, 2],
        [SectionContent.SIGNATURE, 4],
        [SectionContent.SAVE_INDEX, 4],
    ]);
    constructor(source) {
        super(source);
    }
    getData(section, sectionContent) {
        const offset = this.getTotalOffset(section, sectionContent);
        const size = this.getSectionContentSize(sectionContent);
        return this.source.slice(offset, offset + size);
    }
    writeData(section, sectionContent, data) {
        const offset = this.getTotalOffset(section, sectionContent);
        const size = this.getSectionContentSize(sectionContent);
        if (data.length !== size) {
            console.log("Length of data:", data.length);
            console.log("Size of section content:", size);
            throw new Error("Length of data doesn't match size of section content.");
        }
        this.source.splice(offset, size, ...data);
    }
    getTotalOffset(section, sectionContent) {
        const blockOffset = this.getBlockOffset(this.getCurrentBlock());
        const sectionOffset = this.getSectionOffset(section);
        const sectionContentOffset = this.getSectionContentOffset(sectionContent);
        return blockOffset + sectionOffset + sectionContentOffset;
    }
    getCurrentBlock() {
        const blockASaveIndex = this.getSaveIndexOfBlock(SaveBlock.A);
        const blockBSaveIndex = this.getSaveIndexOfBlock(SaveBlock.B);
        return blockASaveIndex > blockBSaveIndex ? SaveBlock.A : SaveBlock.B;
    }
    getSaveIndexOfBlock(saveBlock) {
        const blockOffset = this.getBlockOffset(saveBlock);
        const sectionOffset = 0; // Getting save index from section 0
        const sectionContentOffset = this.getSectionContentOffset(SectionContent.SAVE_INDEX);
        return blockOffset + sectionOffset + sectionContentOffset;
    }
    getBlockOffset(saveBlock) {
        return this.getValueFromMap(this.blockOffsets, saveBlock);
    }
    getSectionOffset(section) {
        return section * this.SECTION_SIZE;
    }
    getSectionContentOffset(sectionContent) {
        return this.getValueFromMap(this.sectionContentOffsets, sectionContent);
    }
    getSectionContentSize(sectionContent) {
        return this.getValueFromMap(this.sectionContentSizes, sectionContent);
    }
}
export { SectionContentExtractor };
