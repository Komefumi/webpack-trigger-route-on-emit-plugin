const Pup = require("puppeteer");
const { ensureURLExistsAsync } = require("./utils");

class TriggerRoutePingPlugin {
  constructor(options) {
    this.name = "TriggerRoutePingPlugin";
    if (!(options?.routes instanceof Array)) {
      throw new Error(
        "Options must be provided with valid routes (as an array)"
      );
    }
    const baseURL = options.baseURL;
    ensureURLExistsAsync(baseURL).catch(() => {
      TriggerRoutePingPlugin.warnForURLNotExistingOrNotReady(baseURL);
    });
    this.options = options;
    this.options.routes = this.options.routes.map(
      (route) => new URL(route, baseURL).href
    );
  }

  static warnForURLNotExistingOrNotReady(url) {
    console.log(
      "Warning: Provided URL '" + url + "' does not exist, or is not ready"
    );
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap(this.name, (_compilation) => {
      (async () => {
        const browser = await Pup.launch();
        const page = await browser.newPage();
        for (let route of this.options.routes) {
          await page.goto(route);
        }

        await browser.close();
      })();
    });
  }
}

module.exports = TriggerRoutePingPlugin;
