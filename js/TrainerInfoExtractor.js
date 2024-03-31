import { Extractor } from "./Extractor";
import { TrainerInfo } from "./TrainerInfo";
class TrainerInfoExtractor extends Extractor {
    trainerInfoOffsets = new Map([
        [TrainerInfo.PLAYER_NAME, 0],
        [TrainerInfo.PLAYER_GENDER, 8],
        [TrainerInfo.TRAINER_ID, 10],
        [TrainerInfo.TIME_PLAYED, 14],
        [TrainerInfo.OPTIONS, 19],
        [TrainerInfo.GAME_CODE, 182],
        [TrainerInfo.SECURITY_KEY, 2808]
    ]);
    trainerInfoSizes = new Map([
        [TrainerInfo.PLAYER_NAME, 7],
        [TrainerInfo.PLAYER_GENDER, 1],
        [TrainerInfo.TRAINER_ID, 4],
        [TrainerInfo.TIME_PLAYED, 5],
        [TrainerInfo.OPTIONS, 3],
        [TrainerInfo.GAME_CODE, 4],
        [TrainerInfo.SECURITY_KEY, 4]
    ]);
    constructor(source) {
        super(source);
    }
    getData(trainerInfo) {
        const offset = this.getTrainerInfoOffset(trainerInfo);
        const size = this.getTrainerInfoSize(trainerInfo);
        return this.source.slice(offset, offset + size);
    }
    writeData(trainerInfo, data) {
        const offset = this.getTrainerInfoOffset(trainerInfo);
        const size = this.getTrainerInfoSize(trainerInfo);
        if (data.length !== size) {
            console.log("Length of data:", data.length);
            console.log("Size of section content:", size);
            throw new Error("Length of data doesn't match size of section content.");
        }
        this.source.splice(offset, size, ...data);
    }
    getTrainerInfoOffset(trainerInfo) {
        return this.getValueFromMap(this.trainerInfoOffsets, trainerInfo);
    }
    getTrainerInfoSize(trainerInfo) {
        return this.getValueFromMap(this.trainerInfoSizes, trainerInfo);
    }
}
export { TrainerInfoExtractor };
