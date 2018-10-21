import fs from 'fs';
import {Renderer, Route} from 'origami-core-lib';
import Server from 'origami-core-server';
import path from 'path';
import {promisify} from 'util';
import { API_PREFIX } from '../lib/const';

const readDir = promisify(fs.readdir);

module.exports = (app: Server, themePath: string, renderer: Renderer) => {
    const templatesPath = path.resolve(themePath, 'views/templates');

    // Get a list of the templates in the theme/views/templates directory, and
    // return the settings for each template
    const r = new Route(`${API_PREFIX}/theme/templates`)
        .position('store')
        .get(async(req, res, next) => {
            // Get a list of the templates
            const templates = (await readDir(templatesPath))
                .filter(f => !f.endsWith('.json'))
                .map(f => path.join(templatesPath, f))
                .filter(f => fs.statSync(f).isFile());

            const files: {[template: string]: object | true} = {};

            templates.forEach(t => {
                const base = path.basename(t).split('.').slice(0, -1).join('.');

                const fileSplit = t.split('.').slice(0, -1);
                fileSplit.push('settings.json');
                const settingFile = fileSplit.join('.');

                files[base] = {
                    type: path.extname(t).slice(1),
                    properties: false
                };

                try {
                    fs.statSync(settingFile).isFile();
                    // @ts-ignore
                    files[base].properties = require(settingFile);
                } catch (e) {}
            });

            res.data = files;


            next();
        });

    app.useRouter(r);
};
