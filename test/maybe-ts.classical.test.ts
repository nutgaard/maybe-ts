import { MaybeCls as Maybe } from '../src/maybe-ts';

describe('Maybe', () => {
  describe('class', () => {
    describe('of', () => {
      it('should create Just(3)', () => {
        expect(Maybe.just(3).withDefault(0)).toBe(3);
        expect(Maybe.of(3).withDefault(0)).toBe(3);
      });

      it('should create Nothing from null', () => {
        expect(Maybe.just((null as unknown) as number).withDefault(0)).toBe(0);
        expect(Maybe.of((null as unknown) as number).withDefault(0)).toBe(0);
      });

      it('should create Nothing from undefind', () => {
        expect(Maybe.just((undefined as unknown) as number).withDefault(0)).toBe(0);
        expect(Maybe.of((undefined as unknown) as number).withDefault(0)).toBe(0);
      });
    });

    describe('withDefault', () => {
      it('should return value', () => {
        const maybeNumber = Maybe.just(3);

        expect(maybeNumber.withDefault(0)).toBe(3);
        expect(maybeNumber.getOrElse(0)).toBe(3);
      });
      it('should return defaultValue', () => {
        const nothing = Maybe.nothing();

        expect(nothing.withDefault(3)).toBe(3);
        expect(nothing.getOrElse(3)).toBe(3);
      });
      it('should return defaultValue even if null', () => {
        const nothing = Maybe.nothing();

        expect(nothing.withDefault(null)).toBe(null);
        expect(nothing.getOrElse(null)).toBe(null);
      });
    });

    describe('map', () => {
      it('should ignore Nothing value', () => {
        expect(Maybe.nothing().map(() => 3)).toEqual(Maybe.nothing());
      });
      it('should map using function value', () => {
        expect(Maybe.just('').map(() => 3)).toEqual(Maybe.just(3));
      });
      it('should convert to Nothing if function return null', () => {
        expect(Maybe.just('').map(() => null)).toEqual(Maybe.nothing());
      });
    });

    describe('map2', () => {
      const nullNumber = Maybe.just((null as unknown) as number);
      const add = (a: number, b: number) => a + b;

      it('should ignore if both value is Nothing', () => {
        expect(nullNumber.map2(add, Maybe.nothing())).toEqual(Maybe.nothing());
      });
      it('should ignore if first value is Nothing', () => {
        expect(Maybe.just(4).map2(add, Maybe.nothing())).toEqual(Maybe.nothing());
      });
      it('should ignore if second value is Nothing', () => {
        expect(nullNumber.map2(add, Maybe.just(3))).toEqual(Maybe.nothing());
      });
      it('should map user function if both are Just', () => {
        expect(Maybe.just(4).map2(add, Maybe.just(3))).toEqual(Maybe.just(7));
      });
      it('should convert to Nothing if function return null', () => {
        expect(Maybe.just(4).map2(() => null, Maybe.just(3))).toEqual(Maybe.nothing());
      });
    });

    describe('filter', () => {
      it('should propagate Nothing', () => {
        expect(Maybe.nothing().filter(() => true)).toEqual(Maybe.nothing());
      });
      it('should convert to Nothing if predicate fails', () => {
        expect(Maybe.just(3).filter(() => false)).toEqual(Maybe.nothing());
      });
      it('should keep Mayeb if predicate is ok', () => {
        const maybe = Maybe.just(3);
        expect(maybe.filter(() => true)).toEqual(maybe);
      });
    });

    describe('join', () => {
      it('should return Just if both is Just', () => {
        expect(Maybe.join(Maybe.just(Maybe.just(3)))).toEqual(Maybe.just(3));
      });
      it('should return Nothing if outer is Nothing', () => {
        expect(Maybe.join(Maybe.nothing())).toEqual(Maybe.nothing());
      });
      it('should return Nothing if inner is Nothing', () => {
        expect(Maybe.join(Maybe.just(Maybe.nothing()))).toEqual(Maybe.nothing());
      });
    });

    describe('andThen', () => {
      it('should propagate Nothing', () => {
        const nullNumber = Maybe.just((null as unknown) as number);
        expect(nullNumber.andThen(() => Maybe.just(3))).toEqual(Maybe.nothing());
        expect(nullNumber.flatMap(() => Maybe.just(3))).toEqual(Maybe.nothing());
      });
      it('should flatten nested Maybe', () => {
        expect(Maybe.just(0).andThen(() => Maybe.just(3))).toEqual(Maybe.just(3));
        expect(Maybe.just(0).flatMap(() => Maybe.just(3))).toEqual(Maybe.just(3));
      });
      it('should convert to Nothing if null is returned', () => {
        expect(Maybe.just(0).andThen(() => null as any)).toEqual(Maybe.nothing());
        expect(Maybe.just(0).flatMap(() => null as any)).toEqual(Maybe.nothing());
      });
    });

    describe('or', () => {
      it('should keep first if Just', () => {
        expect(Maybe.just(3).or(Maybe.just(4))).toEqual(Maybe.just(3));
        expect(Maybe.just(3).or(Maybe.nothing())).toEqual(Maybe.just(3));
      });
      it('should keep second if Just', () => {
        expect(Maybe.nothing().or(Maybe.just(4))).toEqual(Maybe.just(4));
      });
      it('should return Nothing if both are Nothing', () => {
        expect(Maybe.nothing().or(Maybe.nothing())).toEqual(Maybe.nothing());
      });
    });

    describe('toArray', () => {
      it('should return empty array if Nothing', () => {
        expect(Maybe.nothing().toArray()).toEqual([]);
      });
      it('should return array with value if Just', () => {
        expect(Maybe.just(3).toArray()).toEqual([3]);
      });
    });

    describe('isJust', () => {
      expect(Maybe.just(3).isJust()).toBe(true);
      expect(Maybe.just(null as any).isJust()).toBe(false);
      expect(Maybe.nothing().isJust()).toBe(false);
    });

    it('isNothing', () => {
      expect(Maybe.just(3).isNothing()).toBe(false);
      expect(Maybe.just(null as any).isNothing()).toBe(true);
      expect(Maybe.nothing().isNothing()).toBe(true);
    });
  });
});
