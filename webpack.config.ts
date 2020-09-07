import path from  'path';
import webpack from  'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackCleanupPlugin from 'webpack-cleanup-plugin';

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';


/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

import TerserPlugin from 'terser-webpack-plugin';

const isProduction = process.argv.indexOf('-p') >= 0;

export default {
    target: 'web',
    mode: isProduction ? 'production' : 'development',
    entry: './src/main.tsx',
    devtool: isProduction ? false : 'cheap-source-map',
    
    plugins: [
		new webpack.ProgressPlugin(),
        ...(isProduction ? [new WebpackCleanupPlugin()] : []),
        new HtmlWebpackPlugin({
            template: './server/public/index.html',
        }),
    ],

	module: {
		rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: [/node_modules/]},
            { test: /\.tsx$/, loader: 'babel-loader!ts-loader', exclude: [/node_modules/] },
			{
				test: /.css$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',

						options: {
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
                            ident: 'postcss',
                            
							plugins: [tailwindcss, autoprefixer],
						}
					}
				]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    // outputPath: 'assets/',
                },
            },
		]
	},

	resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            app: path.resolve(__dirname, 'src/app/'),
        },
	},

	optimization: {
		minimizer: [new TerserPlugin()],

		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
    },
};