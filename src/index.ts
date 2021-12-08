import { URL } from "url";
import { Compiler, Compilation } from "webpack";
import Pup from "puppeteer";
import { ensureURLExistsAsync } from "./utils";

type CheckTriggerType = () => Promise<boolean> | boolean;

interface IOptions {
  routes: string[];
  baseURL: string;
  initialCheckTrigger?: CheckTriggerType;
  beforeCheckTrigger?: CheckTriggerType;
}

class TriggerRoutePingPlugin {
  static pluginName = "TriggerTouePingPlugin";
  options: IOptions;
  isInitialCheckNeeded: boolean;
  hasInitialCheckPassed: boolean | null;
  constructor(options: IOptions) {
    this.isInitialCheckNeeded = options.initialCheckTrigger ? true : false;
    this.hasInitialCheckPassed = options.initialCheckTrigger ? false : null;
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

  static warnForURLNotExistingOrNotReady(url: string) {
    console.log(
      "Warning: Provided URL '" + url + "' does not exist, or is not ready"
    );
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tap(
      TriggerRoutePingPlugin.pluginName,
      (_compilation: Compilation) => {
        (async () => {
          const { isInitialCheckNeeded, hasInitialCheckPassed } = this;
          if (isInitialCheckNeeded && !hasInitialCheckPassed) {
            const initialCheckTrigger = this.options
              .initialCheckTrigger as CheckTriggerType;
            const checkResult = await initialCheckTrigger();
            if (!checkResult) return;
            this.hasInitialCheckPassed = true;
          }
          const { beforeCheckTrigger } = this.options;
          if (beforeCheckTrigger) {
            const checkResult = await beforeCheckTrigger();
            if (!checkResult) return;
          }
          const browser = await Pup.launch();
          const page = await browser.newPage();
          for (let route of this.options.routes) {
            await page.goto(route);
          }

          await browser.close();
        })();
      }
    );
  }
}

export default TriggerRoutePingPlugin;

export {
  ensureURLExistsAsync,
};
