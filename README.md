# Maybe-ts

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/nutgaard/maybe-ts.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![codecov](https://codecov.io/gh/nutgaard/maybe-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/nutgaard/yet-another-fetch-mock)
[![dependencies Status](https://david-dm.org/nutgaard/maybe-ts/status.svg)](https://david-dm.org/nutgaard/yet-another-fetch-mock)

Maybe monad for typescript inspired by elm's Maybe.

## Installation:
```
npm install @nutgaard/maybe-ts --save
```

## Examples
The library exports two different ways of using the `Maybe`-monad, functional and classical.

**NB!** Uses different ways of importing the library.

Function:
```
import Maybe from 'maybe-ts';

Maybe.map((value) => value.toUpperCase(), Maybe.just('Hello, World'));

// If you use a library for `compose`/`flow`/`pipe` or similar concepts. (See ./test/pipe.ts example)
pipe(
  Maybe.just('Hello, World'),
  Maybe.map((value: string) => value.toUpperCase())
);

// Or, with the use of the pipe-operator
Maybe.just('Hello, World')
  |> Maybe.map((value) => value.toUpperCase())
```

Classical:
```
import { MaybeCls as Maybe } from '../src/maybe-ts';

Maybe.just('Hello, World')
  .map((value) => value.toUpperCase())
```

#### Types
Full documentation of types can be seen [here](https://www.utgaard.xyz/maybe-ts/)

## Credits

Made using the awesome [typescript library starter](https://github.com/alexjoverm/typescript-library-starter) 
