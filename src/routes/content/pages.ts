import {Renderer, Route} from 'origami-core-lib';
import Server from 'origami-core-server';
import {getPageData, switchRender} from '../lib/renderingMW';

// Server pages from theme folder
module.exports = (app: Server, themePath: string, renderer: Renderer) => {

    app.useRouter(new Route('/:path(*)?/:page?')
        .position('store')
        .use(getPageData)
        .position('pre-render')
        .use(switchRender(themePath, renderer))
    );
};
