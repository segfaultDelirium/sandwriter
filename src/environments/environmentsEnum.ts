/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
// this indicates angular server not api server! It is used for
export type Environment = {
  production: boolean;
  apiServerUrl: ApiServerUrl;
};

export enum ApiServerUrl {
  DEVELOPMENT = 'http://localhost:4000/api/',
  PRODUCTION = 'http://139.162.175.250:4000/api/',
}
