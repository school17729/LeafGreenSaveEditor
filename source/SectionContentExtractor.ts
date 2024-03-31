import {SaveBlock} from "./SaveBlock";
import {SectionContent} from "./SectionContent";
import {Section} from "./Section";
import {Extractor} from "./Extractor";

class SectionContentExtractor extends Extractor {

    private BLOCK_SIZE: number = 57344;
    private SECTION_SIZE: number = 4096;

    private blockOffsets: Map<SaveBlock, number> = new Map<SaveBlock, number>([
        [SaveBlock.A, 0],
        [SaveBlock.B, this.BLOCK_SIZE]
    ]);

    private sectionContentOffsets: Map<SectionContent, number> = new Map<SectionContent, number>([
        [SectionContent.DATA, 0],
        [SectionContent.SECTION_ID, 3968],
        [SectionContent.CHECKSUM, 3970],
        [SectionContent.SIGNATURE, 3972],
        [SectionContent.SAVE_INDEX, 3976],
    ]);

    private sectionContentSizes: Map<SectionContent, number> = new Map<SectionContent, number>([
        [SectionContent.DATA, 3968],
        [SectionContent.SECTION_ID, 2],
        [SectionContent.CHECKSUM, 2],
        [SectionContent.SIGNATURE, 4],
        [SectionContent.SAVE_INDEX, 4],
    ]);

    public constructor(source: number[]) {
        super(source);
    }

    public getData(section: Section, sectionContent: SectionContent): number[] {
        const offset: number = this.getTotalOffset(section, sectionContent);
        const size: number = this.getSectionContentSize(sectionContent);

        return this.source.slice(offset, offset + size);
    }

    public writeData(section: Section, sectionContent: SectionContent, data: number[]): void {
        const offset: number = this.getTotalOffset(section, sectionContent);
        const size: number = this.getSectionContentSize(sectionContent);

        if (data.length !== size) {
            console.log("Length of data:", data.length);
            console.log("Size of section content:", size);
            throw new Error("Length of data doesn't match size of section content.");
        }

        this.source.splice(offset, size, ...data);
    }

    private getTotalOffset(section: Section, sectionContent: SectionContent): number {
        const blockOffset: number = this.getBlockOffset(this.getCurrentBlock());
        const sectionOffset: number = this.getSectionOffset(section);
        const sectionContentOffset: number = this.getSectionContentOffset(sectionContent);

        return blockOffset + sectionOffset + sectionContentOffset;
    }

    private getCurrentBlock(): SaveBlock {
        const blockASaveIndex: number = this.getSaveIndexOfBlock(SaveBlock.A);
        const blockBSaveIndex: number = this.getSaveIndexOfBlock(SaveBlock.B);
        return blockASaveIndex > blockBSaveIndex ? SaveBlock.A : SaveBlock.B;
    }

    private getSaveIndexOfBlock(saveBlock: SaveBlock): number {
        const blockOffset: number = this.getBlockOffset(saveBlock);
        const sectionOffset: number = 0; // Getting save index from section 0
        const sectionContentOffset: number = this.getSectionContentOffset(SectionContent.SAVE_INDEX);

        return blockOffset + sectionOffset + sectionContentOffset;
    }

    private getBlockOffset(saveBlock: SaveBlock): number {
        return this.getValueFromMap(this.blockOffsets, saveBlock);
    }

    private getSectionOffset(section: Section): number {
        return (section as number) * this.SECTION_SIZE;
    }

    private getSectionContentOffset(sectionContent: SectionContent): number {
        return this.getValueFromMap(this.sectionContentOffsets, sectionContent);
    }

    private getSectionContentSize(sectionContent: SectionContent): number {
        return this.getValueFromMap(this.sectionContentSizes, sectionContent);
    }
}

export { SectionContentExtractor };