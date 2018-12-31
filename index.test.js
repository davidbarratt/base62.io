const crypto = require('crypto');
const {
  createEncoder,
  encode,
  decode,
  GMP,
  INVERTED,
} = require('./index');

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L555
describe.each([[GMP], [INVERTED], ['1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']])('use character set', (characters) => {
  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L56
  test('encode and decode random bytes', () => {
    const data = crypto.randomBytes(128).toString();
    const encoder = createEncoder({ characters });
    const decoded = encoder.decode(encoder.encode(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L90
  test('encode and decode integers', () => {
    const data = 987654321;
    const encoder = createEncoder({ characters });
    const decoded = encoder.decodeInt(encoder.encodeInt(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L133
  test('encode and decode with leading zero', () => {
    const data = Buffer.from('07d8e31da269bf28', 'hex').toString('binary');
    const encoder = createEncoder({ characters });
    const decoded = encoder.decode(encoder.encode(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L292
  test('encode and decode big integers', () => {
    const data = Number.MAX_SAFE_INTEGER;
    const encoder = createEncoder({ characters });
    const decoded = encoder.decodeInt(encoder.encodeInt(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L422
  test('encode and decode single zero byte', () => {
    const data = '\x00';
    const encoder = createEncoder({ characters });
    const decoded = encoder.decode(encoder.encode(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L456
  test('encode and decode multiple zero bytes', () => {
    const data = '\x00\x00\x00';
    const encoder = createEncoder({ characters });
    const decoded = encoder.decode(encoder.encode(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L490
  test('encode and decode single zero byte prefix', () => {
    const data = '\x00\x01\x02';
    const encoder = createEncoder({ characters });
    const decoded = encoder.decode(encoder.encode(data));

    return expect(decoded).toEqual(data);
  });

  // @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L524
  test('encode and decode multiple zero byte prefix', () => {
    const data = '\x00\x00\x00\x01\x02';
    const encoder = createEncoder({ characters });
    const decoded = encoder.decode(encoder.encode(data));

    return expect(decoded).toEqual(data);
  });
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L164
test.each([['Hello world!', 'BfClwpqbAZpeaVbeGIwSh3Djrgbvwbx'], [Buffer.from('0000010203040506', 'hex').toString('binary'), '0062iwmW2r44i2kw']])('use default character set', (data, expected) => {
  const encoded = encode(data);
  const decoded = decode(encoded);

  expect(encoded).toEqual(expected);
  expect(decoded).toEqual(data);
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L164
test.each([['Hello world!', 'latin1', 'T8dgcjRGuYUueWht'], [Buffer.from('0000010203040506', 'hex').toString('binary'), 'utf16', '0062iwmW2r44i2kw']])('use default character set with encoding', (data, encoding, expected) => {
  const encoder = createEncoder({ encoding });
  const encoded = encoder.encode(data);
  const decoded = encoder.decode(encoded);

  expect(encoded).toEqual(expected);
  expect(decoded).toEqual(data);
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L208
test.each([['Hello world!', 'latin1', 't8DGCJrgUyuUEwHT'], [Buffer.from('0000010203040506', 'hex').toString('binary'), 'utf16', '0062IWMw2R44I2KW']])('use inverted character set', (data, encoding, expected) => {
  const encoder = createEncoder({ characters: INVERTED, encoding });
  const encoded = encoder.encode(data);
  const decoded = encoder.decode(encoded);

  expect(encoded).toEqual(expected);
  expect(decoded).toEqual(data);
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L248
test.each([['Hello world!', 'latin1', 't9DGCJrgUyuUEwHT'], [Buffer.from('0000010203040506', 'hex').toString('binary'), 'utf16', '1173IWMw3R55I3KW']])('use custom character set', (data, encoding, expected) => {
  const encoder = createEncoder({ characters: '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', encoding });
  const encoded = encoder.encode(data);
  const decoded = encoder.decode(encoded);

  expect(encoded).toEqual(expected);
  expect(decoded).toEqual(data);
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L323
test('throw exception on decode invalid data', () => {
  const data = 'invalid~data-%@#!@*#-foo';

  return expect(() => {
    decode(data);
  }).toThrow();
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L347
test('throw exception on decode invalid data with custom character set', () => {
  const data = 'T8dgcjRGuYUueWht';
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRS-UVWXYZ';
  const encoder = createEncoder({ characters });

  return expect(() => {
    encoder.decode(data);
  }).toThrow();
});

// @see https://github.com/tuupola/base62/blob/2.0.0/tests/Base62Test.php#L376
test.each([['0023456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'], ['00123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz']])('throw exception with invalid character set', characters => (
  expect(() => {
    createEncoder({ characters });
  }).toThrow()
));
