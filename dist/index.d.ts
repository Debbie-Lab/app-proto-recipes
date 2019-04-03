import Koa = require('koa');
import { AppConfig } from './typing/config';
export default class App extends Koa {
    $config: AppConfig;
    private $views;
    private $routes;
    private $ds;
    private $middlewares;
    private $bundles;
    constructor(config: AppConfig, run?: Function);
    toJSON(): Object;
    start(): void;
}
