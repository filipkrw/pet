import { scrape } from "./scrape.js";

scrape({
  url: "https://google.com",
}).then((pageHtml) => console.log(pageHtml));
