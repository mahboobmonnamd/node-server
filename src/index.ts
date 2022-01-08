import { ExampleRoutes } from './example-route-http/example.routes';
import { expressServer } from './express-server';

expressServer.startServer({ port: 1000 }, [new ExampleRoutes()]);
