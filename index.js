// @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62.php#L38
const GMP = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62.php#L39
const INVERTED = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62/PhpEncoder.php#L47
const convert = (source, sourceBase, targetBase) => {
  let s = [...source];
  let result = [];
  while (s.length) {
    let quotient = [];
    let remainder = 0;
    for (let i = 0; i !== s.length; i += 1) {
      const accumulator = s[i] + remainder * sourceBase;
      const digit = (accumulator - (accumulator % targetBase)) / targetBase;
      remainder = accumulator % targetBase;
      if (quotient.length || digit) {
        quotient = [
          ...quotient,
          digit,
        ];
      }
    }
    result = [
      remainder,
      ...result,
    ];
    s = quotient;
  }

  return result;
};

const getMaxChars = (encoding) => {
  switch (encoding) {
    case 'ascii':
      return 128;
    case 'latin1':
      return 256;
    default:
      return 65536;
  }
};

const createEncoder = (opt) => {
  const options = {
    encoding: 'utf16',
    characters: GMP,
    ...opt,
  };

  if (!['utf16', 'latin1', 'ascii'].includes(options.encoding)) {
    throw new Error('Only utf16, latin1, and ascii character encodings are supported');
  }

  if ([...new Set(options.characters)].length !== 62 || options.characters.length !== 62) {
    throw new Error('Character set must contain 62 unique characters');
  }

  const maxChars = getMaxChars(options.encoding);

  // @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62/BaseEncoder.php#L110
  const validate = (data) => {
    const invalid = [...data].filter(c => !options.characters.includes(c));
    if (invalid.length > 0) {
      throw new Error(`Data contains invalid characters ${invalid}`);
    }
  };

  return {
    // @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62/BaseEncoder.php#L58
    encode: (value) => {
      const data = [...value].map(c => c.charCodeAt(0));

      if (!data.filter(c => c > maxChars)) {
        throw new Error(`Data provided is not ${options.encoding}`);
      }

      let leadingZeroes = 0;
      while (data && data[0] === 0) {
        leadingZeroes += 1;
        data.shift();
      }
      let converted = convert(data, maxChars, 62);
      if (leadingZeroes > 0) {
        converted = [
          ...Array(leadingZeroes).fill(0, 0, leadingZeroes),
          ...converted,
        ];
      }

      return converted.map(index => options.characters[index]).join('');
    },
    // @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62/BaseEncoder.php#L127
    encodeInt: (value) => {
      const data = [value];

      return convert(data, maxChars, 62).map(index => options.characters[index]).join('');
    },
    // @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62/BaseEncoder.php#L83
    decode: (value) => {
      validate(value);
      const data = [...value].map(character => options.characters.indexOf(character));
      let leadingZeroes = 0;
      while (data && data[0] === 0) {
        leadingZeroes += 1;
        data.shift();
      }
      let converted = convert(data, 62, maxChars);
      if (leadingZeroes > 0) {
        converted = [
          ...Array(leadingZeroes).fill(0, 0, leadingZeroes),
          ...converted,
        ];
      }

      return converted.map(code => String.fromCharCode(code)).join('');
    },
    // @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62/BaseEncoder.php#L141
    decodeInt: (value) => {
      validate(value);
      const data = [...value].map(character => options.characters.indexOf(character));

      return parseInt(convert(data, 62, 10).join(''), 10);
    },
  };
};

const encode = value => createEncoder({ characters: GMP }).encode(value);

const encodeInt = value => createEncoder({ characters: GMP }).encodeInt(value);

const decode = value => createEncoder({ characters: GMP }).decode(value);

const decodeInt = value => createEncoder({ characters: GMP }).decodeInt(value);

module.exports = {
  createEncoder,
  encode,
  encodeInt,
  decode,
  decodeInt,
  GMP,
  INVERTED,
};
