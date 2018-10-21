import fs from 'fs';
import Server from 'origami-core-server';
import path from 'path';
import {promisify} from 'util';
import {AppPagesOptions} from '..';
import { error } from 'origami-core-lib';

const readDir = promisify(fs.readdir);

module.exports = async (app: Server, themePath: string, options: AppPagesOptions) => {
    const fp = path.join(themePath, 'routes');
    let files;

    // Load the routes from the theme/routes/ folder
    try {
        files = (await readDir(fp))
            .filter(f => f.endsWith('.js'))
            .map(f => path.join(fp, f));
        // No folder
    } catch { return false; }

    try {
        // Run a function over each file and return the map
        return files.map(f => require(f)(app, options));
    } catch (e) {
        error('Error in loading theme route', e);
    }
};

