import { _d as ValidatePasswordCallbacks, kd as PasswordSettingsData, vd as ZxcvbnResult } from "../../../index-Ch3QvM-g.mjs";
import "../../../moduleManager-BsmFyRrH.mjs";

//#region src/internal/clerk-js/passwords/password.d.ts
type zxcvbnFN = (password: string, userInputs?: (string | number)[]) => ZxcvbnResult;
type UsePasswordConfig = PasswordSettingsData & {
  validatePassword: boolean;
};
type UsePasswordCbs = {
  onValidationError?: (error: string | undefined) => void;
  onValidationSuccess?: () => void;
  onValidationWarning?: (warning: string) => void;
  onValidationInfo?: (info: string) => void;
  onValidationComplexity?: (b: boolean) => void;
};
declare const createValidatePassword: (loadZxcvbn: () => Promise<zxcvbnFN>, config: UsePasswordConfig, callbacks?: ValidatePasswordCallbacks) => (password: string, internalCallbacks?: ValidatePasswordCallbacks) => void;
//#endregion
export { UsePasswordCbs, UsePasswordConfig, createValidatePassword };
//# sourceMappingURL=password.d.mts.map