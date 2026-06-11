import { ClientBuilder, ClientDependenciesBuilder, ClientHeaderBuilder, NormalizedOutputOptions, QueryOptions } from "@orval/core";

//#region src/dependencies.d.ts
declare const getSvelteQueryDependencies: ClientDependenciesBuilder;
declare const getReactQueryDependencies: ClientDependenciesBuilder;
declare const getVueQueryDependencies: ClientDependenciesBuilder;
declare const getSolidQueryDependencies: ClientDependenciesBuilder;
declare const getAngularQueryDependencies: ClientDependenciesBuilder;
//#endregion
//#region src/index.d.ts
declare const generateQueryHeader: ClientHeaderBuilder;
declare const generateQuery: ClientBuilder;
declare const builder: ({
  type,
  options: queryOptions,
  output
}?: {
  type?: "react-query" | "vue-query" | "svelte-query" | "angular-query" | "solid-query";
  options?: QueryOptions;
  output?: NormalizedOutputOptions;
}) => () => {
  client: ClientBuilder;
  header: ClientHeaderBuilder;
  dependencies: ClientDependenciesBuilder;
};
//#endregion
export { builder, builder as default, generateQuery, generateQueryHeader, getAngularQueryDependencies, getReactQueryDependencies, getSolidQueryDependencies, getSvelteQueryDependencies, getVueQueryDependencies };
//# sourceMappingURL=index.d.mts.map