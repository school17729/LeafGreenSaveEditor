let Logic = Object.freeze(
    {
        AND: function(bool0, bool1) {
            return (bool0 && bool1);
        },
        OR: function(bool0, bool1) {
            return (bool0 || bool1);
        },
        NOT: function(bool) {
            return !(bool);
        },
        XOR: function(bool0, bool1) {
            return (bool0 && (!bool1)) || ((!bool0) && bool1);
        }
    }
);

let UintType = Object.freeze(
    {
        UINT_8: 0,
        UINT_16: 1,
        UINT_32: 2,
        UINT_64: 3,
        UINT_128: 4,
        UINT_256: 5
    }
)

let UintFormat = Object.freeze(
    {
        BIN_NUM: 0,
        BIN_STR: 1,
        BIN_ARR_NUM: 2,
        BIN_ARR_STR: 3,
        BIN_ARR_BOOL: 4,
    
        DEC_NUM: 10,
        DEC_STR: 11,
        DEC_ARR_NUM: 12,
        DEC_ARR_STR: 13,
    
        HEX_STR: 20,
        HEX_ARR_STR: 21
    }
);

let UintEndianness = Object.freeze(
    {
        LITTLE: 0,
        BIG: 1
    }
);

function Uint32(num, format) {
    // defines size in bytes of the uint variable
    this.SIZE = 4;
    // defines type of uint
    this.TYPE = UintType.UINT_32;

    this.endianness = UintEndianness.BIG;

    this.memory = new Array(this.SIZE * 8);
    if (format === UintFormat.BIN_ARR_NUM) {
        this.binArrNumConstructor(num);
    } else if (format === UintFormat.DEC_NUM) {
        this.decNumConstructor(num);
    }
}

Uint32.prototype.binArrNumConstructor = function(arr) {
    this.memory = arr;
    this.littleEndianize();
}

Uint32.prototype.decNumConstructor = function(num) {
    // converts a decimal to an array of bits
    let stringBin = num.toString(2);
    this.memory = stringBin.split("");
    for (let i = 0; i < this.memory.length; i++) {
        this.memory[i] = parseInt(this.memory[i]);
    }
    while (this.memory.length < (this.SIZE * 8)) {
        this.memory.unshift(0);
    }
    while (this.memory.length > (this.SIZE * 8)) {
        this.memory.shift();
    }
    this.littleEndianize();
}

Uint32.prototype.flipEndian = function() {
    let mem = [];
    for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < 8; j++) {
            // (this.SIZE * 8) is the size in bits
            // - (8 * (i + 1)) is the negative offset in bits from the end of the memory array
            // j is the positive offset in bits from the negative offset
            mem.push(this.memory[(this.SIZE * 8) - (8 * (i + 1)) + j]);
        }
    }
    return mem;
}

Uint32.prototype.littleEndian = function() {
    let mem = new Array(this.SIZE * 8);
    mem = this.memory;
    if (this.endianness === UintEndianness.BIG) {
        mem = this.flipEndian();
    }
    return mem;
    
}

Uint32.prototype.bigEndian = function() {
    let mem = new Array(this.SIZE * 8);
    if (this.endianness === UintEndianness.LITTLE) {
        mem = this.flipEndian();
    }
    return mem;
}

Uint32.prototype.littleEndianize = function() {
    this.memory = this.littleEndian();
    this.endianness = UintEndianness.LITTLE;
}

Uint32.prototype.bigEndianize = function() {
    this.memory = this.bigEndian();
    this.endianness = UintEndianness.BIG;
}

Uint32.prototype.add = function(uint32Obj) {
    // defines variables needed for addition
    let sum = new Array(this.SIZE * 8);
    let carry = false;

    // converts each uint to big endian format for addition
    this.bigEndianize();
    uint32Obj.bigEndianize();

    // converts each uint's memory to boolean
    function convertToBool(element) {
        return Boolean(element);
    }
    let boolMem = this.memory.map(convertToBool);
    let boolObjMem = uint32Obj.memory.map(convertToBool);

    // performs addition
    for (let i = (this.SIZE * 8) - 1; i >= 0; i--) {
        let node0 = boolMem[i];
        let node1 = boolObjMem[i];
        let node2 = carry;
        let node3 = Logic.XOR(node0, node1);
        let node4 = Logic.XOR(node3, node2); // sum
        let node5 = Logic.AND(node0, node1);
        let node6 = Logic.AND(node2, node3);
        let node7 = Logic.OR(node5, node6); // carry
        sum[i] = Number(node4);
        carry = node7;
    }

    // converts each uint back to little endian format
    this.littleEndianize();
    uint32Obj.littleEndianize();

    return new Uint32(sum, UintFormat.BIN_ARR_NUM);
}

Uint32.prototype.asNum = function() {
    this.bigEndianize();
    let binStr = this.memory.join("");
    this.littleEndianize();
    return parseInt(binStr, 2);
}

function Uint16(num, format) {
    // defines size in bytes of the uint variable
    this.SIZE = 2;
    // defines type of uint
    this.TYPE = UintType.UINT_16;

    this.endianness = UintEndianness.BIG;

    this.memory = new Array(this.SIZE * 8);
    if (format === UintFormat.BIN_ARR_NUM) {
        this.binArrNumConstructor(num);
    } else if (format === UintFormat.DEC_NUM) {
        this.decNumConstructor(num);
    }
}

Uint16.prototype.binArrNumConstructor = function(arr) {
    this.memory = arr;
    this.littleEndianize();
}

Uint16.prototype.decNumConstructor = function(num) {
    // converts a decimal to an array of bits
    let stringBin = num.toString(2);
    this.memory = stringBin.split("");
    for (let i = 0; i < this.memory.length; i++) {
        this.memory[i] = parseInt(this.memory[i]);
    }
    while (this.memory.length < (this.SIZE * 8)) {
        this.memory.unshift(0);
    }
    while (this.memory.length > (this.SIZE * 8)) {
        this.memory.shift();
    }
    this.littleEndianize();
}

Uint16.prototype.flipEndian = function() {
    let mem = [];
    for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < 8; j++) {
            // (this.SIZE * 8) is the size in bits
            // - (8 * (i + 1)) is the negative offset in bits from the end of the memory array
            // j is the positive offset in bits from the negative offset
            mem.push(this.memory[(this.SIZE * 8) - (8 * (i + 1)) + j]);
        }
    }
    return mem;
}

Uint16.prototype.littleEndian = function() {
    let mem = new Array(this.SIZE * 8);
    mem = this.memory;
    if (this.endianness === UintEndianness.BIG) {
        mem = this.flipEndian();
    }
    return mem;
    
}

Uint16.prototype.bigEndian = function() {
    let mem = new Array(this.SIZE * 8);
    if (this.endianness === UintEndianness.LITTLE) {
        mem = this.flipEndian();
    }
    return mem;
}

Uint16.prototype.littleEndianize = function() {
    this.memory = this.littleEndian();
    this.endianness = UintEndianness.LITTLE;
}

Uint16.prototype.bigEndianize = function() {
    this.memory = this.bigEndian();
    this.endianness = UintEndianness.BIG;
}

Uint16.prototype.add = function(uint16Obj) {
    // defines variables needed for addition
    let sum = new Array(this.SIZE * 8);
    let carry = false;

    // converts each uint to big endian format for addition
    this.bigEndianize();
    uint16Obj.bigEndianize();

    // converts each uint's memory to boolean
    function convertToBool(element) {
        return Boolean(element);
    }
    let boolMem = this.memory.map(convertToBool);
    let boolObjMem = uint16Obj.memory.map(convertToBool);

    // performs addition
    for (let i = (this.SIZE * 8) - 1; i >= 0; i--) {
        let node0 = boolMem[i];
        let node1 = boolObjMem[i];
        let node2 = carry;
        let node3 = Logic.XOR(node0, node1);
        let node4 = Logic.XOR(node3, node2); // sum
        let node5 = Logic.AND(node0, node1);
        let node6 = Logic.AND(node2, node3);
        let node7 = Logic.OR(node5, node6); // carry
        sum[i] = Number(node4);
        carry = node7;
    }

    // converts each uint back to little endian format
    this.littleEndianize();
    uint16Obj.littleEndianize();

    return new Uint16(sum, UintFormat.BIN_ARR_NUM);
}

Uint16.prototype.asNum = function() {
    this.bigEndianize();
    let binStr = this.memory.join("");
    this.littleEndianize();
    return parseInt(binStr, 2);
}