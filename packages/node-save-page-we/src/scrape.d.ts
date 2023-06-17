export function scrape(task: {
  url: string;
  lazyload?: boolean;
}): Promise<string>;
