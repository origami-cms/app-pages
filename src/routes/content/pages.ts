import { Renderer, Route, Server } from '@origami/core';
import { getPageData, switchRender } from '../lib/renderingMW';

// Server pages from theme folder
module.exports = (app: Server, themePath: string, renderer: Renderer) => {
  app.useRouter(
    new Route('/:path(*)?/:page?')
      .position('store')
      .use(getPageData)
      .position('pre-render')
      .use(switchRender(themePath, renderer))
  );
};
