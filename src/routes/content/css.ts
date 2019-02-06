import { findFile, Renderer, Route, Server } from '@origami/core';
import path from 'path';

// Serve css or pre-css documents from theme folder
module.exports = (app: Server, themePath: string, renderer: Renderer) => {
  const cssPath = path.resolve(themePath, 'styles');

  app.useRouter(
    new Route('/theme/:path(*)?/:file.css')
      .position('render')
      .use(async (req, res, next) => {
        // Get the nested css directory
        const dir = path.resolve(cssPath, req.params.path || '');

        let file;
        try {
          // Load the first matched file
          file = await findFile(dir, req.params.file);
          if (typeof file !== 'string') return next();

          res.type('css');
          // Pipe the rendered css to the response
          const rendered = await renderer.render(file, {
            includePaths: [
              // Use the node_modules of the library and the theme as
              // includePaths for node-sass
              path.dirname(file),
              path.resolve(themePath, 'node_modules'),
              path.resolve(process.cwd(), 'node_modules')
            ]
          });

          res.locals.content.set(rendered);
          next();

        } catch (err) {
          next(err); // 404
        }
      })
  );
};
