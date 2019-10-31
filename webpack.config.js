const path = require('path');
const webpack = require('webpack');
const env = require('./env.json');

var imports = {};

var resolveImports = function(e = "")
{
    if(e === "prerender")
    {
        imports = {
            PrerenderSPAPlugin: require('prerender-spa-plugin'),
            Renderer: require('prerender-spa-plugin').PuppeteerRenderer,
            SitemapPlugin: require('sitemap-webpack-plugin').default,

            fs: require('fs'),
            rimraf: require('rimraf'),
            parseString: require('xml2js').parseString
        }
    }
    else
    {
        imports = {
            FixStyleOnlyEntriesPlugin: require("webpack-fix-style-only-entries"),
            MiniCssExtractPlugin: require('mini-css-extract-plugin'),
            VueLoaderPlugin: require('vue-loader/lib/plugin'),
            OptimizeCssAssetsPlugin: require('optimize-css-assets-webpack-plugin')
        };
    }
}

var resolveConfig = 
{
    "default": function(resolve = null)
    {
        let config = {
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
                        loader: imports.MiniCssExtractPlugin.loader,
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
                  }
                ]
            },
            plugins: [
                new imports.FixStyleOnlyEntriesPlugin(),
                new imports.MiniCssExtractPlugin({
                    filename: "css/style.css",
                  }),
                new imports.VueLoaderPlugin(),
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
        }

        if(resolve !== null)
        {
            resolve(config);
        }
        else
        {
            return config;
        }
    },
    "prod": function(resolve = null)
    {
        let config = resolveConfig["default"]();

        config.mode = "production";
        config.watch = false;
        config.resolve.alias.Vue = path.resolve('./node_modules/vue/dist/vue.min.js');
        config.plugins.push(new imports.OptimizeCssAssetsPlugin({assetNameRegExp: /\.css$/g }));

        if(resolve !== null)
        {
            resolve(config);
        }
        else
        {
            return config;
        }
    },
    "prerender": function(resolve = null)
    {

        let config = {
            mode: "production",
            watch: false,
            entry:
            {
                "phantomOutput": './resources/phantomEntry.js'
            },
            output:
            {
                path: path.resolve('./resources/'),
                filename: '[name].js'
            },
            plugins: []
        };

        imports.rimraf('./public/prerender', imports.fs, (error) => {
            if(error){console.log(error);}
        });

        let routes = [];
        routes.push('/');

        imports.fs.readFile(env.datas, (err, data) => {
            if (err) {
                throw err;
            }

            imports.parseString(data, (err, result) => {
                let timelineElements = result.root.timeline[0].element;
                timelineElements.forEach((e) => {

                    routes.push('/parcours/' + e.$.slug);
                });

                let skillwheelElements = result.root.skillwheel[0].element;
                skillwheelElements.forEach((e) => {

                    routes.push('/competences/' + e.$.slug);
                });

                config.plugins.push(new imports.PrerenderSPAPlugin({
                    staticDir: path.join(__dirname, 'public'),
                    indexPath: path.join(__dirname, 'public/index.html'),
                    outputDir: path.join(__dirname, 'public/prerender'),
                    routes: routes,
                    renderer: new imports.Renderer({
                        renderAfterTime: 5000
                    })
                }));

                config.plugins.push(new imports.SitemapPlugin(env.domain, routes, {
                    skipGzip: true,
                    fileName: 'sitemap.xml'
                }));

                resolve(config);
            });
        });
    }
};

module.exports = function(e)
{
    resolveImports(e);

    return new Promise((resolve, reject) => {
        if(e !== null && e !== undefined)
        {
            resolveConfig[e](resolve);
        }
        else
        {
            resolveConfig["default"](resolve);
        }
        
    });
}