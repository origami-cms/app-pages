import {ReadStream} from 'fs';
import {findFile, Renderer, Route} from 'origami-core-lib';
import Server from 'origami-core-server';
import path from 'path';

// Serve css or pre-css documents from theme folder
module.exports = (app: Server, themePath: string, renderer: Renderer) => {
    const cssPath = path.resolve(themePath, 'styles');

    app.useRouter(new Route('/theme/:path(*)?/:file.css')
        .position('render')
        .use(async (req, res, next) => {
            // Get the nested css directory
            const dir = path.resolve(cssPath, req.params.path || '');

            let file;
            try {
                // Load the first matched file
                file = await findFile(dir, req.params.file);
                if (typeof file !== 'string') return next();

                res.header('content-type', 'text/css');
                // Pipe the rendered css to the response
                (renderer.render(file, {
                    includePaths: [
                        // Use the node_modules of the library and the theme as
                        // includePaths for node-sass
                        path.resolve(themePath, 'node_modules'),
                        path.resolve(process.cwd(), 'node_modules')
                    ]
                }) as ReadStream)
                    .on('error', next)
                    .pipe(res);


            } catch (err) {
                next(err); // 404
            }
        })
    );
};
