export type FeatureMeta = {
  name: string;
};

export class Feature {
  private meta: FeatureMeta;

  constructor(name: string) {
    this.meta = { name };
  }

  getMeta() {
    return { feature: this.meta };
  }
}
