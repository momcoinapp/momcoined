const { encodeAbiParameters, parseAbiParameters } = require('viem');

const args = encodeAbiParameters(
    parseAbiParameters('address, address, address'),
    [
        '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        '0x2177bcac5c26507bfb4f0ff2ccbd255ae4bedb07',
        '0x71041dddad3595f745215c98a9d8413013817846'
    ]
);

console.log(args);
