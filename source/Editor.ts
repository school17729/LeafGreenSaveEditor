abstract class Editor {
    protected source: number[];

    protected constructor(source: number[]) {
        this.source = source;
    }

    protected getValueFromMap<T, U>(map: Map<T, U>, key: T): U {
        const value: U | undefined = map.get(key);
        if (value === undefined) {
            console.log("Key:", key);
            console.log("Map:", map);
            throw new Error("Couldn't find key in map.");
        }
        return value;
    }
}

export { Editor };