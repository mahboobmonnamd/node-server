import { ExpressHttpServerMethods } from './expressHttpServer.interface';

export interface ExpressRoutes {
  routesDefinition(httpServer: ExpressHttpServerMethods): void;
}
