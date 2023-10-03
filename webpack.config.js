const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ['./src/index.ts'],
    // watch: true,
    output: {
        path: path.join(__dirname, 'dist'),
        // publicPath: '/dist/',
        filename: 'index.[hash:8].js',
        // chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    //* webpack开发服务器. 它不会自动更新html, 所以我更推荐启用watch然后使用Live Server --FBIK.
    devServer: {
        open: false,
        port: 8080,
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
        new HtmlWebpackPlugin({
            template: './src/index.tpl.html',
            inject: 'body',
            minify: true,
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './desktop/niva/niva.json', // 输入文件
                    to: 'niva.json', // 输出文件
                },
            ],
        }),
        new PurgeCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/**/*'), { nodir: true }),
        }),
        new CompressionPlugin({
            filename: '[base].gz',
            // exclude: /index\.html$/,
            test: /\.(js|css|html)/i,
            algorithm: 'gzip',
            compressionOptions: { level: 1 },
            threshold: 8192,
            minRatio: 0.8,
            deleteOriginalAssets: false, // 让服务端可以根据http请求选择返回经过gzip压缩后的内容
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|js)$/i,
                // use: 'ts-loader', // esbuild-loader 更快, 但是如果有*.d.ts就得完善配置
                loader: 'esbuild-loader',
                options: {
                    // JavaScript version to compile to
                    target: 'es2015',
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
