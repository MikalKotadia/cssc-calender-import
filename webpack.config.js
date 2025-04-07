// webpack.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    devtool: 'cheap-module-source-map', // Or another option that doesn't use eval
    context: path.resolve(__dirname, '.'),
    entry: {
        popup: './src/popup/index.ts',
        content: './src/content/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/index.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/popup/index.html', to: 'popup/index.html' },
                { from: 'src/popup/index.css', to: 'popup/index.css' },
                // { from: 'src/images', to: 'images' },
            ],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
        hot: true,
        liveReload: true,
        open: true,
    },
};
