const path = require('path');
const webpack = require('webpack');

const PrerenderSPAPlugin = require('prerender-spa-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


var configDefault =
{
    mode: 'development',
    entry: 
    {
        "css/style": './resources/style.scss',
        "js/app": './resources/app.js'
    },
    output: 
    {
        path: path.resolve('./public/'),
        filename: '[name].js'
    },
    watch: true,
    module: 
    {
        rules: [
        { 
            test: /\.scss$/, 
            use: [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: 'css-loader',
                options: {
                    url: false,
                }
            },
            {
                loader: 'sass-loader',
            }
            ]
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/style.css",
          }),
        new VueLoaderPlugin(),
        /*
        new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender.
            staticDir: path.join(__dirname, 'public'),
            outputDir: path.join(__dirname, 'public/prerender'),
            // Required - Routes to render.
            routes: [ '/' ],
          })
        */
    ],
    resolve:
    {
        alias:
        {
            Vue: path.resolve('./node_modules/vue/dist/vue.js'),
            Config: path.resolve('./resources/config.js'),
            Modules: path.resolve('./resources/modules'),
            Utils: path.resolve('./resources/utils'),
        }
    }
};



var configModifiers = 
{
    "prod": function()
    {
        configDefault.mode = "production";
        configDefault.resolve.alias.Vue = path.resolve('./node_modules/vue/dist/vue.min.js');
        configDefault.plugins.push(new OptimizeCssAssetsPlugin({assetNameRegExp: /\.css$/g }));
    }
};



module.exports = function(e)
{
    if(e !== null && e !== undefined)
    {
        configModifiers[e]();
    }
    return configDefault;
}