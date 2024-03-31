class Logic {
    static and(value0, value1) {
        return value0 && value1;
    }
    static or(value0, value1) {
        return value0 || value1;
    }
    static not(value0) {
        return !value0;
    }
    static xor(value0, value1) {
        return value0 && !value1 || !value0 && value1;
    }
}
export { Logic };
