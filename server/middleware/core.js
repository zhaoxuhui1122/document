/**
 * CORS middleware for koa2
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Array} allowMethods `Access-Control-Allow-Methods`, default is ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS']
 *  - {Array} allowHeaders `Access-Control-Allow-Headers`
 * @return {Function}
 * @api public
 */
export default (options = {})=> {
  const defaultOptions = {
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
  };

  for (let key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key];
    }
  }

  return async function (ctx, next) {
    let origin;
    if (typeof options.origin === 'function') {
      origin = options.origin(ctx);
    } else {
      origin = options.origin || ctx.get('Origin') || '*';
    }
    if (!origin) {
      return await next();
    }

    ctx.set('Access-Control-Allow-Origin', origin);

    if (ctx.method === 'OPTIONS') {
      if (!ctx.get('Access-Control-Request-Method')) {
        return await next();
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', String(options.maxAge));
      }

      if (options.credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods.join(','));
      }

      if (options.allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', options.allowHeaders.join(','));
      } else {
        ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
      }

      ctx.status = 204; // No Content
    } else {
      if (options.credentials === true) {
        if (origin === '*') {
          ctx.remove('Access-Control-Allow-Credentials');
        } else {
          ctx.set('Access-Control-Allow-Credentials', 'true');
        }
      }

      if (options.exposeHeaders) {
        ctx.set('Access-Control-Expose-Headers', options.exposeHeaders.join(','));
      }

      try {
        await next();
      } catch (err) {
        throw err;
      }
    }
  };
};
