import path from 'path';
import minify from 'rollup-plugin-babel-minify';
import multi from 'rollup-plugin-multi-entry';
import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import strip from 'rollup-plugin-strip';
import alias from 'rollup-plugin-alias';

const isProduction = process.env.NODE_ENV === "production";


export default {
    input: {
        include: [path.resolve(__dirname, './jsBuild/app.js')],
    },
    output: {
        format: 'iife',
        name: 'OrigamiAppPages',
        file: 'public/app.min.js'
    },
    plugins: [
        alias({
            'actions': path.resolve(__dirname, './scripts/actions')
        }),
        multi(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        node(),
        commonjs(),
        // json({
        //     include: 'node_modules/bcrypt/**',
        // }),

        ...(isProduction ? [
            strip(),
            minify({
                comments: false
            })
        ] : [])
    ],


}
