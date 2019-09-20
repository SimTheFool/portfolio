const path = require('path');
const webpack = require('webpack');
const env = require('./env.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const SitemapPlugin = require('sitemap-webpack-plugin').default;

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
        configDefault.watch = false;
        configDefault.resolve.alias.Vue = path.resolve('./node_modules/vue/dist/vue.min.js');
        configDefault.plugins.push(new OptimizeCssAssetsPlugin({assetNameRegExp: /\.css$/g }));
    },
    "prerender": function()
    {
        const datas = require(env.datas);

        let routes = [];
        routes.push('/');

        for(let elem of datas.timeline)
        {
            routes.push('/parcours/' + elem.slug);
        }

        for(let elem of datas.skillwheel)
        {
            routes.push('/competences/' + elem.slug);
        }

        configModifiers.prod();
        configDefault.plugins.push(new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'public'),
            indexPath: path.join(__dirname, 'public/index.html'),
            outputDir: path.join(__dirname, 'public/prerender'),
            routes: routes,
            renderer: new Renderer({
                renderAfterTime: 5000
            })
        }));
        configDefault.plugins.push(new SitemapPlugin(env.domain, routes, {
            skipGzip: true,
            fileName: 'sitemap.xml'
        }));
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