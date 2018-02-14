// https://github.com/krasimir/webpack-library-starter

// Webpack config for creating libs
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const path = require('path');

export default (env) => {

    const ClosureCompiler = new ClosureCompilerPlugin({
        compiler: {
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT5',
            //compilation_level: 'ADVANCED'
        },
        concurrency: 3,
    })

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'ycad.js',
            libraryTarget: 'umd',
            library: 'YCAD',
            publicPath: "/dist/",
            umdNamedDefine: true
        },
        devtool: 'source-map',
        module: {
            rules: [
                { test: /\.js$/, exclude: /node_modules/, loader: require.resolve("babel-loader") }
            ]
        },
        plugins: [
            //ClosureCompiler
        ]
    }
}