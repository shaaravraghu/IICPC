import { kd as PasswordSettingsData, vd as ZxcvbnResult } from "../../../index-Ch3QvM-g.mjs";
import "../../../moduleManager-BsmFyRrH.mjs";

//#region src/internal/clerk-js/passwords/strength.d.ts
type zxcvbnFN = (password: string, userInputs?: (string | number)[]) => ZxcvbnResult;
type PasswordStrength = {
  state: 'excellent';
  result: ZxcvbnResult;
} | {
  state: 'pass' | 'fail';
  keys: string[];
  result: ZxcvbnResult;
};
type CreateValidatePasswordStrength = (options: Pick<PasswordSettingsData, 'min_zxcvbn_strength'> & {
  onResult?: (res: ZxcvbnResult) => void;
}) => (zxcvbn: zxcvbnFN) => (password: string) => PasswordStrength;
declare const createValidatePasswordStrength: CreateValidatePasswordStrength;
//#endregion
export { createValidatePasswordStrength };
//# sourceMappingURL=strength.d.mts.map