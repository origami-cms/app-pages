import { Renderer, Route, Server } from '@origami/core';
import { API_PREFIX } from '../lib/const';
import { renderTemplate } from '../lib/renderingMW';

module.exports = (app: Server, themePath: string, renderer: Renderer) => {
  // Generate a preview of the page
  const r = new Route(`${API_PREFIX}/theme/preview/:template`)
    .use('auth')
    .position('store')
    .post((req, res, next) => {
      // Assign the body's data to the response data for the template
      res.locals.content.set({
        type: req.params.template,
        data: req.body
      });
      next();
    })
    .position('render')
    .post(renderTemplate(themePath, renderer));

  app.useRouter(r);
};
