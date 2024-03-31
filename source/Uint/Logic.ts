class Logic {
    static and(value0: boolean, value1: boolean): boolean {
        return value0 && value1;
    }

    static or(value0: boolean, value1: boolean): boolean {
        return value0 || value1;
    }

    static not(value0: boolean): boolean {
        return !value0;
    }

    static xor(value0: boolean, value1: boolean): boolean {
        return value0 && !value1 || !value0 && value1;
    }
}

export { Logic };