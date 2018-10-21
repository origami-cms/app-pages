import {statSync} from 'fs';
import {Renderer, resolveLib, error} from 'origami-core-lib';
import Server from 'origami-core-server';
import path from 'path';

// Render sass/less/etc files from the theme's styles directory
import cssRouter from './content/css';

// Render pages in the theme/pages directory
import pagesRouter from './content/pages';

// Render the templates in the theme/templates directory
import templateRouter from './pages/templates';

// Render the templates in the pages/templates directory
import previewRouter from './pages/preview';

// Mount all the routes in the themes routes/ folder
import routesRouter from './themeRoutes';


const renderer = new Renderer();

export interface AppPagesOptions {
    theme?: string;
}


module.exports = async (app: Server, options: AppPagesOptions) => {
    const {theme} = options;
    if (typeof theme !== 'string') return error(new Error('App.Theme: theme is not a string'));

    // const themeConfig = await requireLib(`${theme}/theme.js`, process.cwd(), 'theme');
    let themePath = await resolveLib(theme, process.cwd(), 'origami-theme-');
    if (statSync(themePath).isFile()) themePath = path.dirname(themePath);

    [
        cssRouter,
        pagesRouter,
        templateRouter,
        previewRouter
    ].forEach(r => r(app, themePath, renderer));

    routesRouter(app, themePath, options);


    // Setup the static files from the 'public' folder
    app.static(path.resolve(themePath, 'public'));
};
