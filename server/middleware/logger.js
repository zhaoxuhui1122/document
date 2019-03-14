import logger from '../utils/logger'
import koaLogger from 'koa-logger';

export default  async(ctx,next)=>{
   await next();
   console.log(ctx);
}
