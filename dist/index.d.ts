import Koa = require('koa');
import { AppConfig } from './types/config';
export interface MiddlewareContext extends Koa.Context {
    $config: AppConfig;
    [key: string]: any;
}
export default class App extends Koa {
    private ctx;
    constructor(config: AppConfig);
    toJSON(): Object;
}
