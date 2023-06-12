export type FeatureMeta = {
  name: string;
};

export class Feature {
  meta: FeatureMeta;

  constructor(public name: string) {
    this.meta = { name };
  }

  getMeta() {
    return { feature: this.meta };
  }
}
