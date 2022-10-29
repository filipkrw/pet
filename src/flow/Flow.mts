const ValueSymbol = Symbol("FlowValue");
const ErrorSymbol = Symbol("FlowError");

type FlowValue<T> = {
  type: typeof ValueSymbol;
  value: T;
};

type FlowError = {
  type: typeof ErrorSymbol;
  value: Error;
};

export class Flow<T> {
  constructor(private data: FlowValue<T> | FlowError) {}

  static from<T>(value: T): Flow<T> {
    return new Flow<T>({ type: ValueSymbol, value });
  }

  static fromError<T>(error: Error): Flow<T> {
    return new Flow<T>({ type: ErrorSymbol, value: error });
  }

  pipe<U>(f: (value: T) => U): Flow<U> {
    if (this.data.type === ValueSymbol) {
      try {
        return Flow.from(f(this.data.value));
      } catch (e) {
        if (e instanceof Error) {
          return Flow.fromError(e);
        }
        throw e;
      }
    }
    return Flow.fromError(this.data.value);
  }

  catch(f: (error: FlowError) => void): Flow<T> {
    if (this.data.type === ErrorSymbol) {
      f(this.data);
    }
    return this;
  }
}
