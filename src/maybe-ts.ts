export enum MaybeType {
  JUST = 'JUST',
  NOTHING = 'NOTHING'
}

type Just<TYPE> = { type: MaybeType.JUST; value: TYPE };
type Nothing = { type: MaybeType.NOTHING };
export type Maybe<TYPE> = Just<TYPE> | Nothing;
const NothingValue: Nothing = { type: MaybeType.NOTHING };

export class MaybeCls<TYPE> {
  private maybe: Maybe<TYPE>;

  private constructor(maybe: Maybe<TYPE>) {
    this.maybe = maybe;
  }

  public static of<TYPE>(value: TYPE): MaybeCls<TYPE> {
    return new MaybeCls(of(value));
  }

  public static just<TYPE>(value: TYPE): MaybeCls<TYPE> {
    return new MaybeCls(of(value));
  }

  public static nothing<TYPE>(): MaybeCls<TYPE> {
    return new MaybeCls<TYPE>(NothingValue);
  }

  public static join<TYPE>(maybe: MaybeCls<MaybeCls<TYPE>>): MaybeCls<TYPE> {
    return maybe.withDefault(MaybeCls.nothing());
  }

  public withDefault(defaultValue: TYPE): TYPE {
    return withDefault(defaultValue, this.maybe);
  }

  public map<NEWTYPE>(fn: (value: TYPE) => NEWTYPE): MaybeCls<NEWTYPE> {
    return new MaybeCls(map(fn, this.maybe));
  }

  public map2<OTHER, NEWTYPE>(
    fn: (value: TYPE, other: OTHER) => NEWTYPE,
    other: MaybeCls<OTHER>
  ): MaybeCls<NEWTYPE> {
    return new MaybeCls(map2(fn, other.maybe, this.maybe));
  }

  public filter(predicate: (value: TYPE) => boolean): MaybeCls<TYPE> {
    return new MaybeCls(filter(predicate, this.maybe));
  }

  public andThen<NEWTYPE>(fn: (value: TYPE) => MaybeCls<NEWTYPE>): MaybeCls<NEWTYPE> {
    const fn2: (value: TYPE) => Maybe<NEWTYPE> = (value: TYPE) => {
      const res: MaybeCls<NEWTYPE> = fn(value);
      if (res && res.maybe) {
        return res.maybe;
      }
      return NothingValue;
    };
    return new MaybeCls(andThen(fn2, this.maybe));
  }

  public isNothing(): boolean {
    return isNothing(this.maybe);
  }

  public isJust(): boolean {
    return isJust(this.maybe);
  }

  public or(other: MaybeCls<TYPE>): MaybeCls<TYPE> {
    return new MaybeCls(or(this.maybe, other.maybe));
  }

  public toArray(): Array<TYPE> {
    return toArray(this.maybe);
  }
}

function typeMatching<TYPE, RETURN>(
  ifNothing: () => RETURN,
  ifJust: (value: TYPE) => RETURN,
  maybe: Maybe<TYPE>
): RETURN {
  switch (maybe.type) {
    case MaybeType.NOTHING:
      return ifNothing();
    case MaybeType.JUST:
      return ifJust(maybe.value);
  }
}

function of<TYPE>(value: TYPE | null | undefined): Maybe<TYPE> {
  if (value === null || value === undefined) {
    return NothingValue;
  }
  return { type: MaybeType.JUST, value: value };
}

function withDefault<TYPE>(defaultValue: TYPE, maybe: Maybe<TYPE>): TYPE {
  return typeMatching(() => defaultValue, value => value, maybe);
}

function map<TYPE, NEWTYPE>(fn: (value: TYPE) => NEWTYPE, maybe: Maybe<TYPE>): Maybe<NEWTYPE> {
  return typeMatching(() => NothingValue, value => of(fn(value)), maybe);
}

function map2<TYPE, OTHER, NEWTYPE>(
  fn: (value: TYPE, other: OTHER) => NEWTYPE,
  other: Maybe<OTHER>,
  maybe: Maybe<TYPE>
): Maybe<NEWTYPE> {
  return typeMatching(
    () => NothingValue,
    (value: TYPE) =>
      typeMatching(() => NothingValue, (other: OTHER) => of(fn(value, other)), other),
    maybe
  );
}

function filter<TYPE>(predicate: (value: TYPE) => boolean, maybe: Maybe<TYPE>): Maybe<TYPE> {
  return typeMatching(
    () => NothingValue,
    value => (predicate(value) ? maybe : NothingValue),
    maybe
  );
}

function join<TYPE>(maybe: Maybe<Maybe<TYPE>>): Maybe<TYPE> {
  return typeMatching(() => NothingValue, value => value, maybe);
}

function andThen<TYPE, NEWTYPE>(
  fn: (value: TYPE) => Maybe<NEWTYPE>,
  maybe: Maybe<TYPE>
): Maybe<NEWTYPE> {
  return typeMatching(() => NothingValue, value => join(of(fn(value))), maybe);
}

function isNothing(maybe: Maybe<any>): boolean {
  return maybe.type === MaybeType.NOTHING;
}

function isJust(maybe: Maybe<any>): boolean {
  return maybe.type === MaybeType.JUST;
}

function or<TYPE>(maybe: Maybe<TYPE>, other: Maybe<TYPE>): Maybe<TYPE> {
  return typeMatching(() => other, () => maybe, maybe);
}

function toArray<TYPE>(maybe: Maybe<TYPE>): Array<TYPE> {
  return typeMatching(() => [], value => [value], maybe);
}

function nothing() {
  return NothingValue;
}

export default {
  of,
  just: of,
  withDefault,
  map,
  map2,
  filter,
  join,
  flat: join,
  andThen,
  flatMap: andThen,
  isNothing,
  isJust,
  or,
  toArray,
  nothing
};
