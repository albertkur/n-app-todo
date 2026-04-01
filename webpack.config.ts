/* eslint-disable @typescript-eslint/no-unsafe-call */
import "@nivinjoseph/n-ext";
import * as Path from "path";
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
import { ConfigurationManager } from "@nivinjoseph/n-config";
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
import * as Zlib from "zlib";


const env = ConfigurationManager.requireStringConfig("env");
console.log("WEBPACK ENV", env);

const isDev = env === "dev";

const tsLoader = {
    loader: "ts-loader",
    options: {
        configFile: Path.resolve(__dirname, "tsconfig.client.json"),
        transpileOnly: true,
        compilerOptions: { skipLibCheck: true, sourceMap: true, inlineSourceMap: false, declarationMap: false }
    }
};


const moduleRules: Array<any> = [
    {
        test: /\.(scss|sass)$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false
                }
            },
            {
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    esModule: false
                }
            },
            {
                loader: "postcss-loader", // postcss
                options: {
                    postcssOptions: {
                        plugins: [
                            "postcss-flexbugs-fixes",
                            autoprefixer({
                                // browsers: [
                                //     ">1%",
                                //     "not ie < 9"
                                // ],
                                flexbox: "no-2009"
                            })
                        ]
                    }
                }
            },
            {
                loader: "sass-loader" // compiles Sass to CSS -> depends on node-sass
            }
        ]
    },
    {
        test: /\.css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false
                }
            },
            {
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    esModule: false
                }
            }
        ]
    },
    {
        test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader",
                    esModule: false,
                    name: (_resourcePath: string, _resourceQuery: string): string =>
                    {
                        // `resourcePath` - `/absolute/path/to/file.js`
                        // `resourceQuery` - `?foo=bar`

                        if (process.env.NODE_ENV === "development")
                        {
                            return "[path][name].[ext]";
                        }

                        return "[contenthash]-[name].[ext]";

                        // return "[path][name].[ext]";
                    }
                }
            },
            {
                loader: "@nivinjoseph/n-app/dist/loaders/raster-image-loader.js",
                options: {
                    // urlEncodeLimit: isDev ? 0 : 10000,
                    jpegQuality: 80,
                    pngQuality: 60
                }
            }
        ]
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            isDev ? "file-loader" : {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader"
                }
            }
        ]
    },
    {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [tsLoader]
    },
    {
        test: /-resolver\.ts$/,
        use: [
            { loader: "@nivinjoseph/n-app/dist/loaders/resolver-loader.js" },
            tsLoader
        ]
    },
    {
        test: /-view-model\.ts$/,
        use: [
            { loader: "@nivinjoseph/n-app/dist/loaders/view-model-loader.js" },
            tsLoader
        ]
    },
    {
        test: /-view-model\.js$/,
        use: [
            { loader: "@nivinjoseph/n-app/dist/loaders/view-model-loader.js" }
        ]
    },
    {
        test: /-view\.html$/,
        exclude: [Path.resolve(__dirname, "src/server")],
        use: [
            ...isDev ? [] :
                [{
                    loader: "@nivinjoseph/n-app/dist/loaders/view-ts-check-loader.js"
                },
                {
                    loader: "vue-loader/lib/loaders/templateLoader.js"
                },
                {
                    loader: "@nivinjoseph/n-app/dist/loaders/view-loader.js"
                }],
            {
                loader: "html-loader",
                options: {
                    esModule: false
                }
            }
        ]
    },
    {
        test: /-view\.html$/,
        include: [Path.resolve(__dirname, "src/server/controllers/app")],
        use: [
            {
                loader: "html-loader",
                options: {
                    esModule: false
                }
            }
        ]
    }
];

const plugins = [
    new ForkTsCheckerWebpackPlugin({
        async: isDev,
        typescript: {
            configFile: Path.resolve(__dirname, "tsconfig.client.json"),
            configOverwrite: {
                compilerOptions: { skipLibCheck: true, sourceMap: true, inlineSourceMap: false, declarationMap: false }
            }
        }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: Path.resolve(__dirname, "src/server/controllers/index-view.html"),
        filename: "index-view.html",
        // TODO: need favicon
        // favicon: Path.resolve(__dirname, "../client-common/src/images/favicon-32x32.png"),
        hash: true,
        minify: false
    }),
    new HtmlWebpackTagsPlugin({
        append: false,
        usePublicPath: false,
        tags: []
    }),
    new MiniCssExtractPlugin({}),
    new webpack.DefinePlugin({
        APP_CONFIG: JSON.stringify({})
    }),
    new webpack.ProvidePlugin({
        $: "jquery",

        ...Object.keys(require("tslib"))
            .reduce<Record<string, Array<string>>>((acc, key) =>
            {
                acc[key] = ["tslib", key];
                return acc;
            }, {})
    })
];

if (isDev)
{
    // moduleRules.push({
    //     test: /\.js$/,
    //     loader: "source-map-loader",
    //     enforce: "pre"
    // });

    plugins.push(new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/]
    }));

    plugins.push(new webpack.HotModuleReplacementPlugin());
}
else
{
    moduleRules.push({
        test: /\.js$/,
        include: [
            Path.resolve(__dirname, "src/client"),
            Path.resolve(__dirname, "src/sdk")
        ],
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"]
            }
        }
    });

    plugins.push(...[
        new CompressionPlugin({
            test: /\.(js|css|svg)$/,
            algorithm: "brotliCompress",
            compressionOptions: {
                params: {
                    [Zlib.constants.BROTLI_PARAM_QUALITY]: Zlib.constants.BROTLI_MAX_QUALITY
                }
            }
        })
    ]);
}

module.exports = {
    context: process.cwd(),
    mode: isDev ? "development" : "production",
    target: "web",
    entry: {
        main: [Path.resolve(__dirname, "src/client/client.ts"), isDev ? "webpack-hot-middleware/client" : null].where(t => t != null)
    },
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        path: Path.resolve(__dirname, "src/client/dist"),
        publicPath: "/"
    },
    devtool: isDev ? "source-map" : false,
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all"
        },
        minimizer: [
            new TerserPlugin({
                exclude: /(vendors|\.worker)/,
                terserOptions: {
                    keep_classnames: false,
                    keep_fnames: false,
                    safari10: true,
                    mangle: true,
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ]
    },
    module: {
        rules: moduleRules
    },
    plugins: plugins,
    resolve: {
        extensions: [".ts", ".js"],
        symlinks: false,
        alias: {
            vue: isDev ? "@nivinjoseph/vue/dist/vue.js" : "@nivinjoseph/vue/dist/vue.runtime.common.prod.js",
            "tslib$": "tslib/tslib.es6.js"
        }
    }
};
