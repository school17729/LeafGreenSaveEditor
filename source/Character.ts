class Character {

    private str: string;
    private num: number;

    constructor(str: string, num: number) {
        this.str = str;
        this.num = num;
    }

    public getStr(): string {
        return this.str;
    }

    public getNum(): number {
        return this.num;
    }
}

export { Character };