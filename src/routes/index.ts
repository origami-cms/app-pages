import { error, Renderer, resolveLib, Server } from '@origami/core';
import { statSync } from 'fs';
import path from 'path';
// Render sass/less/etc files from the theme's styles directory
// @ts-ignore
import cssRouter from './content/css';
// Render pages in the theme/pages directory
// @ts-ignore
import pagesRouter from './content/pages';
// Render the templates in the pages/templates directory
// @ts-ignore
import previewRouter from './pages/preview';
// Render the templates in the theme/templates directory
// @ts-ignore
import templateRouter from './pages/templates';
// Mount all the routes in the themes routes/ folder
// @ts-ignore
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
    ].forEach((r) => r(app, themePath, renderer));

    routesRouter(app, themePath, options);


    // Setup the static files from the 'public' folder
    app.static(path.resolve(themePath, 'public'));
};
