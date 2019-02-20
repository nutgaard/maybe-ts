import Maybe, { MaybeType } from '../src/maybe-ts';

describe('Maybe', () => {
  describe('functional', () => {
    describe('of', () => {
      it('should create Just(3)', () => {
        const maybeNumber = Maybe.just(3);

        expect(maybeNumber.type).toBe(MaybeType.JUST);
        expect(Maybe.withDefault(0, maybeNumber)).toBe(3);
      });

      it('should create Nothing from null', () => {
        const maybeNumber = Maybe.just((null as unknown) as number);

        expect(maybeNumber.type).toBe(MaybeType.NOTHING);
        expect(Maybe.withDefault(0, maybeNumber)).toBe(0);
      });

      it('should create Nothing from undefind', () => {
        const maybeNumber = Maybe.just((undefined as unknown) as number);

        expect(maybeNumber.type).toBe(MaybeType.NOTHING);
        expect(Maybe.withDefault(0, maybeNumber)).toBe(0);
      });
    });

    describe('withDefault', () => {
      it('should return value', () => {
        const maybeNumber = Maybe.just(3);

        expect(Maybe.withDefault(0, maybeNumber)).toBe(3);
      });
      it('should return defaultValue', () => {
        const nothing = Maybe.nothing();

        expect(Maybe.withDefault(3, nothing)).toBe(3);
      });
    });

    describe('map', () => {
      it('should ignore Nothing value', () => {
        expect(Maybe.map(() => 3, Maybe.nothing())).toBe(Maybe.nothing());
      });
      it('should map using function value', () => {
        expect(Maybe.map(() => 3, Maybe.just(''))).toEqual(Maybe.just(3));
      });
      it('should convert to Nothing if function return null', () => {
        expect(Maybe.map(() => null, Maybe.just(''))).toEqual(Maybe.nothing());
      });
    });

    describe('map2', () => {
      const add = (a: number, b: number) => a + b;

      it('should ignore if both value is Nothing', () => {
        expect(Maybe.map2(add, Maybe.nothing(), Maybe.nothing())).toBe(Maybe.nothing());
      });
      it('should ignore if first value is Nothing', () => {
        expect(Maybe.map2(add, Maybe.nothing(), Maybe.just(4))).toBe(Maybe.nothing());
      });
      it('should ignore if second value is Nothing', () => {
        expect(Maybe.map2(add, Maybe.just(3), Maybe.nothing())).toBe(Maybe.nothing());
      });
      it('should map user function if both are Just', () => {
        expect(Maybe.map2(add, Maybe.just(3), Maybe.just(4))).toEqual(Maybe.just(7));
      });
      it('should convert to Nothing if function return null', () => {
        expect(Maybe.map2(() => null, Maybe.just(3), Maybe.just(4))).toBe(Maybe.nothing());
      });
    });

    describe('filter', () => {
      it('should propagate Nothing', () => {
        expect(Maybe.filter(() => true, Maybe.nothing())).toBe(Maybe.nothing());
      });
      it('should convert to Nothing if predicate fails', () => {
        expect(Maybe.filter(() => false, Maybe.just(3))).toBe(Maybe.nothing());
      });
      it('should keep Mayeb if predicate is ok', () => {
        const maybe = Maybe.just(3);
        expect(Maybe.filter(() => true, maybe)).toBe(maybe);
      });
    });

    describe('join', () => {
      it('should return Just if both is Just', () => {
        expect(Maybe.join(Maybe.just(Maybe.just(3)))).toEqual(Maybe.just(3));
      });
      it('should return Nothing if outer is Nothing', () => {
        expect(Maybe.join(Maybe.nothing())).toBe(Maybe.nothing());
      });
      it('should return Nothing if inner is Nothing', () => {
        expect(Maybe.join(Maybe.just(Maybe.nothing()))).toBe(Maybe.nothing());
      });
    });

    describe('andThen', () => {
      it('should propagate Nothing', () => {
        expect(Maybe.andThen(() => Maybe.just(3), Maybe.nothing())).toBe(Maybe.nothing());
      });
      it('should flatten nested Maybe', () => {
        expect(Maybe.andThen(() => Maybe.just(3), Maybe.just(0))).toEqual(Maybe.just(3));
      });
      it('should convert to Nothing if null is returned', () => {
        expect(Maybe.andThen(() => null as any, Maybe.just(0))).toEqual(Maybe.nothing());
      });
    });

    describe('or', () => {
      it('should keep first if Just', () => {
        expect(Maybe.or(Maybe.just(3), Maybe.just(4))).toEqual(Maybe.just(3));
        expect(Maybe.or(Maybe.just(3), Maybe.nothing())).toEqual(Maybe.just(3));
      });
      it('should keep second if Just', () => {
        expect(Maybe.or(Maybe.nothing(), Maybe.just(4))).toEqual(Maybe.just(4));
      });
      it('should return Nothing if both are Nothing', () => {
        expect(Maybe.or(Maybe.nothing(), Maybe.nothing())).toEqual(Maybe.nothing());
      });
    });

    describe('toArray', () => {
      it('should return empty array if Nothing', () => {
        expect(Maybe.toArray(Maybe.nothing())).toEqual([]);
      });
      it('should return array with value if Just', () => {
        expect(Maybe.toArray(Maybe.just(3))).toEqual([3]);
      });
    });

    describe('isJust', () => {
      expect(Maybe.isJust(Maybe.just(3))).toBe(true);
      expect(Maybe.isJust(Maybe.just(null as any))).toBe(false);
      expect(Maybe.isJust(Maybe.nothing())).toBe(false);
    });

    it('isNothing', () => {
      expect(Maybe.isNothing(Maybe.just(3))).toBe(false);
      expect(Maybe.isNothing(Maybe.just(null as any))).toBe(true);
      expect(Maybe.isNothing(Maybe.nothing())).toBe(true);
    });

    it('nothing', () => {
      expect(Maybe.nothing().type).toBe(MaybeType.NOTHING);
    });
  });
});
