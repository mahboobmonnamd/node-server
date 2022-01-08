import { ExpressHttpServerMethods, ExpressRoutes } from '../express-server';
import { NextFunction, Request, Response } from 'express';

export class ExampleRoutes implements ExpressRoutes {
  /**
   * Declare all the routes here
   * @param httpServer
   */
  routesDefinition(httpServer: ExpressHttpServerMethods): void {
    httpServer.get('/', this.hello.bind(this));
  }
  hello(req: Request, res: Response, next: NextFunction) {
    res.send('Hello world');
  }
}
