import { findFile, Origami, Renderer } from '@origami/core';
import path from 'path';
import url from 'url';

// Attempt to lookup a page in the store and save to the request
export const getPageData: Origami.Server.RequestHandler = async (
  req,
  res,
  next
) => {
  const pathname = url.parse(req.originalUrl).pathname;

  const [page] = await res.app
    .get('store')
    .model('page')
    .find({ url: pathname });

  if (page) {
    res.locals.content.set(page.toObject());
    res.locals.isPage = true;
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
    if (res.headersSent) return next();

    if (res.locals.isPage) return template(req, res, next);
    else stat(req, res, next);
  };
};

export const renderTemplate = (
  themePath: string,
  renderer: Renderer
): Origami.Server.RequestHandler => async (req, res, next) => {
  const data = res.locals.content.get() as Origami.ResponseData;
  const type = data.type;

  let template;
  const notFoundError = new Error(`No page type ${type}`);
  try {
    // Load the first matched template
    template = await findFile(path.resolve(themePath, 'views/templates'), type);
    if (typeof template !== 'string') return next(notFoundError);
  } catch {
    return next(notFoundError);
  }

  try {
    res.locals.content.clear();
    res.locals.content.set((await renderer.render(template, data)).toString());
    next();
  } catch (err) {
    res.locals.content.clear();
    next(err); // 404
  }
};

export const renderStatic = (
  themePath: string,
  renderer: Renderer
): Origami.Server.RequestHandler => async (req, res, next) => {
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
  } catch {
    return next();
  }

  try {
    const data = res.locals.content.get() as Origami.ResponseData;
    res.locals.content.clear();
    res.locals.content.set((await renderer.render(pagePath, data)).toString());
    next();
  } catch (err) {
    res.locals.content.clear();
    next(err); // 404
  }
};
