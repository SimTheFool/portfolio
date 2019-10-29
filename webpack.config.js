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

const fs = require('fs');
const parseString = require('xml2js').parseString;

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
                loader: 'postcss-loader',
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
          },
          {
            test: require.resolve('snapsvg/dist/snap.svg.js'),
            use: 'imports-loader?this=>window,fix=>module.exports=0',
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
            Snapsvg: 'snapsvg/dist/snap.svg.js',
            Config: path.resolve('./resources/config.js'),
            Modules: path.resolve('./resources/modules'),
            Utils: path.resolve('./resources/utils'),
        }
    },
    devServer:
    {
        contentBase: path.join(__dirname, 'public'),
        hot: true,
        historyApiFallback: true
    }
};



var configModifiers = 
{
    "prod": function(resolve = null)
    {
        configDefault.mode = "production";
        configDefault.watch = false;
        configDefault.resolve.alias.Vue = path.resolve('./node_modules/vue/dist/vue.min.js');
        configDefault.plugins.push(new OptimizeCssAssetsPlugin({assetNameRegExp: /\.css$/g }));

        if(resolve !== null)
        {
            resolve(configDefault);
        }
    },
    "prerender": function(resolve = null)
    {
        let routes = [];
        routes.push('/');

        fs.readFile(env.datas, (err, data) => {
            if (err) {
                throw err;
            }

            parseString(data, (err, result) => {
                let timelineElements = result.root.timeline[0].element;
                timelineElements.forEach((e) => {

                    routes.push('/parcours/' + e.$.slug);
                });

                let skillwheelElements = result.root.skillwheel[0].element;
                skillwheelElements.forEach((e) => {

                    routes.push('/competences/' + e.$.slug);
                });

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

                configModifiers.prod();

                resolve(configDefault);
            });
        });
    }
};

module.exports = function(e)
{
    if(e !== null && e !== undefined)
    {
        return new Promise((resolve, reject) => {
            configModifiers[e](resolve);
        });
    }

    return configDefault;
}