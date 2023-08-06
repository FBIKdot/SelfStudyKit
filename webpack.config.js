const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier').minify;
module.exports = {
    mode: 'development',
    // devtool: 'inline-source-map',
    entry: ['./src/index.ts', './src/main.js'],
    // watch: true,
    output: {
        path: path.join(__dirname, 'dist'),
        // publicPath: '/dist/',
        filename: 'index.js',
        // chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    //* webpack开发服务器. 它不会自动更新html, 所以我更推荐启用watch然后使用Live Server --FBIK.
    devServer: {
        static: './dist',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // 仅压缩 JavaScript 文件
                        drop_console: true,
                    },
                    mangle: true,
                },
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './index.html', // 输入文件
                    to: 'index.html', // 输出文件
                    transform(content, path) {
                        // 使用 html-minifier 插件进行压缩
                        return HtmlMinifierPlugin(content.toString(), {
                            collapseWhitespace: true,
                            removeComments: true,
                            removeRedundantAttributes: true,
                            removeScriptTypeAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            useShortDoctype: true,
                            minifyCSS: true,
                            minifyJS: true,
                        });
                    },
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                // use: 'ts-loader', // esbuild-loader 更快, 但是如果有*.d.ts就得完善配置
                use: 'esbuild-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(json|html)$/i,
                type: 'asset/resource',
            },
        ],
    },
};
