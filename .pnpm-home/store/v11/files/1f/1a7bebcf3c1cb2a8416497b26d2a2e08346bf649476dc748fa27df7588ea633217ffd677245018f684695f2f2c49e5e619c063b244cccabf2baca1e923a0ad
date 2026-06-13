import { kd as PasswordSettingsData } from "../../../index-DAac51Y8.js";
import "../../../moduleManager-WB15hU3T.js";

//#region src/internal/clerk-js/passwords/complexity.d.ts
type ComplexityErrors = { [key in keyof Partial<Omit<PasswordSettingsData, 'disable_hibp' | 'min_zxcvbn_strength' | 'show_zxcvbn'>>]?: boolean };
type UsePasswordComplexityConfig = Omit<PasswordSettingsData, 'disable_hibp' | 'min_zxcvbn_strength' | 'show_zxcvbn'>;
declare const validate: (password: string, config: UsePasswordComplexityConfig) => ComplexityErrors;
declare const createValidateComplexity: (config: UsePasswordComplexityConfig) => (password: string) => ComplexityErrors;
//#endregion
export { ComplexityErrors, UsePasswordComplexityConfig, createValidateComplexity, validate };
//# sourceMappingURL=complexity.d.ts.map