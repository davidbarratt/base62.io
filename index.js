// @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62.php#L38
const GMP = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// @see https://github.com/tuupola/base62/blob/2.0.0/src/Base62.php#L39
const INVERTED = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const createEncoder = (options) => ({
  encode: (value) => {

  },
  decode: (value) => {

  },
});

const encode = value => createEncoder({ characters: GMP }).encode(value);

const decode = value => createEncoder({ characters: GMP }).decode(value);

module.exports = {
  createEncoder,
  encode,
  decode,
  GMP,
  INVERTED,
};
