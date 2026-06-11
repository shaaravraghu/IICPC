import * as _zxcvbn_ts_core0 from "@zxcvbn-ts/core";
import * as _zxcvbn_ts_language_common0 from "@zxcvbn-ts/language-common";
import * as _base_org_account0 from "@base-org/account";
import * as _coinbase_wallet_sdk0 from "@coinbase/wallet-sdk";
import * as _stripe_stripe_js0 from "@stripe/stripe-js";

//#region src/moduleManager.d.ts
type ImportableModuleToTypeMap = {
  '@zxcvbn-ts/core': typeof _zxcvbn_ts_core0;
  '@zxcvbn-ts/language-common': typeof _zxcvbn_ts_language_common0;
  '@base-org/account': typeof _base_org_account0;
  '@coinbase/wallet-sdk': typeof _coinbase_wallet_sdk0;
  '@stripe/stripe-js': typeof _stripe_stripe_js0;
};
type ImportableModule = keyof ImportableModuleToTypeMap;
interface ModuleManager {
  import: <T extends ImportableModule>(module: T) => Promise<ImportableModuleToTypeMap[T] | undefined>;
}
//#endregion
export { ImportableModuleToTypeMap as n, ModuleManager as r, ImportableModule as t };
//# sourceMappingURL=moduleManager-WB15hU3T.d.ts.map