import { ExpressHttpServerMethods } from './expressHttpServer.interface';
import express, {
  RequestHandler,
  Express,
  Request,
  Response,
  NextFunction,
  urlencoded,
  json,
} from 'express';
import { ServerOpts } from './server.interface';
import { ExpressRoutes } from './expressRoutes.interface';
import compression from 'compression';
import cors from 'cors';

class ExpressServer implements ExpressHttpServerMethods {
  private constructor() {}

  private static _express: Express;
  private static instance: ExpressServer;

  get expressInstance(): Express {
    if (ExpressServer._express === undefined) {
      this.initExpress();
    }
    return ExpressServer._express;
  }

  private shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
  }

  /**
   * To get the instance object of restify server use this function
   */
  public static getInstance() {
    if (!ExpressServer.instance) {
      ExpressServer.instance = new ExpressServer();
    }
    return ExpressServer.instance;
  }

  get(url: string, requestHandler: RequestHandler, middleware: any[] = []): void {
    this.addRoute('get', url, requestHandler, middleware);
  }

  post(url: string, requestHandler: RequestHandler, middleware: any[] = []): void {
    this.addRoute('post', url, requestHandler, middleware);
  }

  put(url: string, requestHandler: RequestHandler, middleware: any[] = []): void {
    this.addRoute('put', url, requestHandler, middleware);
  }

  del(url: string, requestHandler: RequestHandler, middleware: any[] = []): void {
    this.addRoute('del', url, requestHandler, middleware);
  }

  head(url: string, requestHandler: RequestHandler, middleware: any[] = []): void {
    this.addRoute('head', url, requestHandler, middleware);
  }

  /**
   * All
   * @param method defines whether the web service call should be get, post, put, del(delete)
   * @param url path which user will call to access
   * @param requestHandler restify request handler
   */
  private addRoute(
    method: 'get' | 'post' | 'put' | 'del' | 'head',
    url: string,
    requestHandler: RequestHandler,
    middleware,
  ) {
    console.log('file: expressServer.ts ~ line 74 ~ ExpressServer ~ middleware', middleware);
    this.expressInstance[method](
      url,
      ...middleware,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          return await requestHandler(req, res, next);
          // return requestHandler(req, res, next);
        } catch (error) {
          // Store the logger some where
          return res.status(500).send(error);
        }
      },
    );
    console.debug(`Added route ${method.toUpperCase()}: ${url}`);
  }

  private initExpress() {
    ExpressServer._express = express();
  }

  addPlugins(serverOpts: ServerOpts) {
    this.expressInstance.use(compression({ filter: this.shouldCompress }));
    this.expressInstance.use(json());
    this.expressInstance.use(urlencoded({ extended: true }));
    const { plugins } = serverOpts;
    if (plugins && plugins.corsOptions) this.expressInstance.use(cors({ origin: '*' }));
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  startServer(serverOpts: ServerOpts, routes: object[] = null): void {
    try {
      this.addPlugins(serverOpts);
      /**
       * Initialize the routes
       */
      this.initRouteControllers(routes);
      this.expressInstance.listen(serverOpts['port'], () =>
        console.debug(`Server is up and running on port ${serverOpts['port']}`),
      );
    } catch (error) {
      console.error('ExpressServer -> initialize -> error', error);
      process.exit();
    }
  }

  /**
   * Initalize all routes
   * Routes will be passed as the class objects to the arguments
   * @param CONTROLLERS  Pass the routes as object
   */
  private initRouteControllers(CONTROLLERS: any[]) {
    this.get('/health_check', (_, res) => {
      res.sendStatus(200);
    });
    if (CONTROLLERS) {
      CONTROLLERS.forEach((controller: ExpressRoutes) => {
        try {
          if (typeof controller == 'object') {
            /**
             * Every controller routesDefintion will take the input of ExpressHttpServerMethods
             * Passing the class object to provide the defintion of the route
             */
            controller.routesDefinition(this);
          }
        } catch (error) {
          console.error('ApiServer -> initControllers -> error', error);
        }
      });
    }
  }
}

export const expressServer = ExpressServer.getInstance();
