export interface ServerOpts {
  port: number;
  plugins?: {
    corsOptions?: any;
    others: any[];
  };
  env?: serverEnvironment;
  isSSL?: boolean;
}

// export interface RoutesDefinitions {
//   CONTROLLERS: object[];
// }

export enum serverEnvironment {
  development = 0,
  production = 1,
}

export interface ServerSetupOpts {
  /**
   * Server opts to create the server
   */
  serverOpts: ServerOpts;
  /**
   * route controllers needs to be passed here
   */
  routesDefinitions: object[];
}
