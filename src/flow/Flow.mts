type FlowFunc<T, U> = (value: T) => Promise<U>;

export class Flow<T> {
  constructor(private value: T) {
    this.value = value;
  }

  static async of<T>(value: T): Promise<Flow<T>> {
    return Promise.resolve(new Flow(value));
  }

  static async from<U>(flowFunc: FlowFunc<void, U>): Promise<Flow<U>> {
    const result = await flowFunc();
    return new Flow(result);
  }

  async pipe<U>(flowFunc: FlowFunc<T, U>): Promise<Flow<U>> {
    const result = await flowFunc(this.value);
    return new Flow(result);
  }

  get(): T {
    return this.value;
  }
}
