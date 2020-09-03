// https://github.com/krasimir/webpack-library-starter

module.exports = {
  stats: 'minimal',
  entry: './src/index.js',
  output: {
    filename: 'parametric.js',
    libraryTarget: 'window',
    library: 'Parametric'
    // publicPath: '/dist/',
    // umdNamedDefine: true
  },
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src/')
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      // { test: /\.js|es6$/, exclude: /node_modules/ }
      // { test: /\.js|es6$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  // https://webpack.js.org/configuration/externals/
  externals: {
    THREE: 'THREE'
  }
}
