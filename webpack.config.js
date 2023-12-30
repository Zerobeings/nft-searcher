const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
      ,{
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
        fs: false, 
        path: false,
        os: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nftsearcher.js',
    library: 'nftsearcher',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true,
    globalObject: 'this',
    clean: true,
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    "@thirdweb-dev/react": "@thirdweb-dev/react",
  },
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};
