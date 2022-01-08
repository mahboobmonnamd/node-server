import { RequestHandler } from 'express';

/**
 * Interface used to define the http server
 */

export interface ExpressHttpServerMethods {
  /**
   *
   * @param url string Endpoint where our web service needs to be communicated
   * @param requestHandler bind function name with this object
   */
  get(url: string, requestHandler: RequestHandler, middleware?: any[]): void;
  /**
   *
   * @param url string Endpoint where our web service needs to be communicated
   * @param requestHandler bind function name with this object
   */
  post(url: string, requestHandler: RequestHandler, middleware?: any[]): void;
  /**
   *
   * @param url string Endpoint where our web service needs to be communicated
   * @param requestHandler bind function name with this object
   */
  put(url: string, requestHandler: RequestHandler, middleware?: any[]): void;
  /**
   *
   * @param url string Endpoint where our web service needs to be communicated
   * @param requestHandler bind function name with this object
   */
  del(url: string, requestHandler: RequestHandler, middleware?: any[]): void;
  /**
   *
   * @param url string Endpoint where our web service needs to be communicated
   * @param requestHandler bind function name with this object
   */
  head(url: string, requestHandler: RequestHandler, middleware?: any[]): void;
}
