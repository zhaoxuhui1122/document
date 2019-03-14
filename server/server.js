import Koa from 'koa'
const app = new Koa();
import cors from 'koa2-cors';
import router from './router';
import koaStatic from 'koa-static'
import mongodb from './mongodb'
import logger from './utils/logger'
import bodyParser from 'koa-bodyparser' ;
import config from './config/config';
import schedule from './service/schedule';
import koaLogger from 'koa-logger';
import { initRootUser } from './service/user';

schedule()
mongodb();
app.use(bodyParser());
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
app.use(koaLogger((str, args)=>{
   logger.info(str,args.join(''));
}));
app.use(router.routes())
        .use(router.allowedMethods());


app.use(koaStatic(__dirname, './static'));

initRootUser();

app.listen(config.port, err => {
  if(err){
    logger.error(err);
    return ;
  }
  logger.info('server is start！');
});
