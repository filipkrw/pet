type FlowFunc<T, U> = (value: T) => Promise<U>;

const ValueSymbol = Symbol("FlowValue");
const ErrorSymbol = Symbol("FlowError");

type FlowValue<T> = {
  type: typeof ValueSymbol;
  value: T;
};

type FlowError<T> = {
  type: typeof ErrorSymbol;
  value: T;
};

export class Flow<T, TErr> {
  constructor(private data: FlowValue<T> | FlowError<TErr>) {}

  static from<T, TErr>(value: T): Flow<T, TErr> {
    return new Flow<T, TErr>({ type: ValueSymbol, value });
  }

  static fromError<T, TErr>(error: TErr): Flow<T, TErr> {
    return new Flow<T, TErr>({ type: ErrorSymbol, value: error });
  }

  then<U>(f: (value: T) => U): Flow<U, TErr> {
    if (this.data.type === ValueSymbol) {
      return Flow.from(f(this.data.value));
    } else {
      return Flow.fromError(this.data.value);
    }
  }
}
