# base62.io
JavaScript port of [tuupola/base62](https://github.com/tuupola/base62) which is used on [base62.io](https://base62.io/).

## Download
```
npm install base62.io
```

## Basic Usage
**String**
```javascript
const { encode, decode } = require('base62.io');

encode('Hello world!'); // BfClwpqbAZpeaVbeGIwSh3Djrgbvwbx
decode('BfClwpqbAZpeaVbeGIwSh3Djrgbvwbx'); // Hello world!
```
**Int**
```javascript
const { encodeInt, decodeInt } = require('base62.io');

encodeInt(987654321); // 14q60P
decodeInt('14q60P'); // 987654321
```

## Advanced Usage
```javascript
const { createEncoder } = require('base62.io');

const { encode, decode } = createEncoder({
  characters: '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  encoding: 'latin1',
});

encode('Hello world!'); // t9DGCJrgUyuUEwHT
decode('t9DGCJrgUyuUEwHT'); // Hello world!
```

## Character encoding and compatibility with PHP
JavaScript's default [character encoding](https://en.wikipedia.org/wiki/Character_encoding) is [UTF-16](https://en.wikipedia.org/wiki/UTF-16) while PHP's is [latin1](https://en.wikipedia.org/wiki/ISO/IEC_8859-1). Because of this, data encoded in PHP is not compatible with data encoded in JavaScript. To preserve compatibility with the PHP library, set the character encoding to `latin1`. This will only work if the string you are attempting to encode is only made up of latin characters.

```javascript
const { createEncoder } = require('base62.io');

const { encode, decode } = createEncoder({
  encoding: 'latin1',
});

encode('Hello world!'); // t9DGCJrgUyuUEwHT
decode('t9DGCJrgUyuUEwHT'); // Hello world!
```
