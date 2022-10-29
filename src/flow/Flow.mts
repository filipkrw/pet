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

type FlowData<T> = FlowValue<T> | FlowError;

export class Flow<T> {
  constructor(private data: FlowData<T>) {}

  static start(): Flow<null> {
    return new Flow({ type: ValueSymbol, value: null });
  }

  static from<T>(value: T): Flow<T> {
    return new Flow<T>({ type: ValueSymbol, value });
  }

  static fromError<T>(error: Error): Flow<T> {
    return new Flow<T>({ type: ErrorSymbol, value: error });
  }

  then<U>(f: (value: T) => U): Flow<U> {
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

  get(): T {
    if (this.data.type === ValueSymbol) {
      return this.data.value;
    }
    throw this.data.value;
  }
}
