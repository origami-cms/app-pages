import {findFile, Origami, Renderer} from 'origami-core-lib';
import path from 'path';


// Attempt to lookup a page in the store and save to the request
export const getPageData: Origami.Server.RequestHandler = async (req, res, next) => {
    const [page] = await res.app.get('store').model('page').find({url: req.originalUrl});
    if (page) {
        res.data = page;
        res.isPage = true;
    }
    next();
};


export const switchRender = (
    themePath: string,
    renderer: Renderer
): Origami.Server.RequestHandler => {

    const template = renderTemplate(themePath, renderer);
    const stat = renderStatic(themePath, renderer);

    return async (req, res, next) => {
        // If there is already data sent
        if (res.body || res.headersSent) return next();

        if (res.isPage) return template(req, res, next);
        else stat(req, res, next);
    };
};


export const renderTemplate = (
    themePath: string,
    renderer: Renderer
): Origami.Server.RequestHandler =>

    async (req, res, next) => {
        // @ts-ignore
        const type = res.data.type;


        let template;
        const notFoundError = new Error(`No page type ${type}`);
        try {
            // Load the first matched template
            template = await findFile(path.resolve(themePath, 'views/templates'), type);
            if (typeof template !== 'string') return next(notFoundError);

        } catch { return next(notFoundError); }


        try {
            res.send(await renderer.render(template, res.data));
        } catch (err) {
            delete res.data;
            next(err); // 404
        }
    };


export const renderStatic = (
    themePath: string,
    renderer: Renderer
): Origami.Server.RequestHandler =>

    async (req, res, next) => {

        const pagesPath = path.resolve(themePath, 'views/pages');
        let page = req.params.page;

        // Get the nested views directory
        let dir = path.resolve(pagesPath, req.params.path || '');

        if (!req.params.path || req.params.path === 'index.html') {
            page = 'index';
            dir = path.resolve(pagesPath);
        }

        // If there is no page, just a path, then make the page the path
        // and update the dir
        if (!page && req.params.path) {
            page = req.params.path;
            dir = dir.slice(0, page.length * -1);
        }

        let pagePath;
        try {
            // Load the first matched page
            pagePath = await findFile(dir, page);
            if (typeof pagePath !== 'string') return next();

        } catch { return next(); }

        try {
            res.send(await renderer.render(pagePath, res.data));
        } catch (err) {
            delete res.data;
            next(err); // 404
        }
    };
