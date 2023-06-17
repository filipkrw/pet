/**
 * I just cleaned up the code a bit, migrated it to ESM and added a single type.
 * For the actual work I thank the original authors.
 * ~ filipkrw
 */

/************************************************************************/
/*                                                                      */
/*      Based on: Save Page WE - Generic WebExtension - Background Page */
/*                (forked on December 31, 2018)                         */
/*      Copyright (C) 2016-2018 DW-dev                                  */
/*                                                                      */
/*      Adapted for Node/Puppeteer by Markus Mobius                     */
/*      markusmobius@gmail.com                                          */
/*                                                                      */
/*      Distributed under the GNU General Public License version 2      */
/*      See LICENCE.txt file and http://www.gnu.org/licenses/           */
/*                                                                      */
/************************************************************************/

import { EventEmitter } from "events";
import path from "path";
import { launch } from "puppeteer";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function scrape(task) {
  EventEmitter.defaultMaxListeners = 50;

  const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //disable web security to allow CORS requests
  const browser = await launch({
    headless: "new",
    args: [
      "--disable-features=BlockInsecurePrivateNetworkRequests",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
      "--disable-web-security",
      "--proxy-server='direct://'",
      "--proxy-bypass-list=*",
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  );

  await page.setViewport({
    width: 1600,
    height: 10000,
  });

  await page.goto(task.url, {
    timeout: 180000,
    waitUntil: ["domcontentloaded"],
  });

  await page.addScriptTag({
    path: path.join(__dirname, "clientScript.js"),
  });

  await page.evaluate(
    async (params) => {
      runSinglePage(params);
    },
    { lazyload: task.lazyload }
  );

  var savedPageHTML = "";
  while (true) {
    savedPageHTML = await page.evaluate(async () => {
      return htmlFINAL;
    }, {});
    if (savedPageHTML != "NONE") {
      break;
    }
    /*var status = await page.evaluate(async () => {
              return htmlSTATUS;
          }, {});
          console.log(status);*/
    await snooze(100);
  }

  await browser.close();

  return savedPageHTML;
}
