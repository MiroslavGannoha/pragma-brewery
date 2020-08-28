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

/*
 * We've enabled Postcss, autoprefixer and precss for you. This allows your app
 * to lint  CSS, support variables and mixins, transpile future CSS syntax,
 * inline images, and more!
 *
 * To enable SASS or LESS, add the respective loaders to module.rules
 *
 * https://github.com/postcss/postcss
 *
 * https://github.com/postcss/autoprefixer
 *
 * https://github.com/jonathantneal/precss
 *
 */

import autoprefixer from 'autoprefixer';
import precss from 'precss';

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
        new WebpackCleanupPlugin(),
        new HtmlWebpackPlugin({
            template: './server/public/index.html',
        }),
        new MiniCssExtractPlugin({ filename: 'main.[chunkhash].css' }),
    ],

	module: {
		rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: [/node_modules/]},
            { test: /\.tsx$/, loader: 'babel-loader!ts-loader', exclude: [/node_modules/] },
			{
				test: /.css$/,

				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
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
							plugins: function() {
								return [precss, autoprefixer];
							}
						}
					}
				]
			}
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
	}
};