import { ClientBuilder, ClientGeneratorsBuilder, ClientHeaderBuilder, GeneratorDependency, GeneratorOptions, GeneratorVerbOptions } from "@orval/core";

//#region src/index.d.ts
declare const getFetchDependencies: () => GeneratorDependency[];
declare const generateRequestFunction: ({
  queryParams,
  headers,
  operationName,
  response,
  mutator,
  body,
  props,
  verb,
  fetchReviver,
  formData,
  formUrlEncoded,
  override,
  doc
}: GeneratorVerbOptions, {
  route,
  context,
  pathRoute
}: GeneratorOptions) => string;
declare const fetchResponseTypeName: (includeHttpResponseReturnType: boolean | undefined, definitionSuccessResponse: string, operationName: string) => string;
declare const generateClient: ClientBuilder;
declare const generateFetchHeader: ClientHeaderBuilder;
declare const builder: () => () => ClientGeneratorsBuilder;
//#endregion
export { builder, builder as default, fetchResponseTypeName, generateClient, generateFetchHeader, generateRequestFunction, getFetchDependencies };
//# sourceMappingURL=index.d.mts.map