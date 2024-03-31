class Extractor {
    source;
    constructor(source) {
        this.source = source;
    }
    getValueFromMap(map, key) {
        const value = map.get(key);
        if (value === undefined) {
            console.log("Key:", key);
            console.log("Map:", map);
            throw new Error("Couldn't find key in map.");
        }
        return value;
    }
}
export { Extractor };
