const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');

module.exports = (env) => {
  const mode = process.env.NODE_ENV || 'development';

  const config = {
    entry: './src/index.js',
    resolve: { extensions: ['.js', '.jsx'] },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.join(__dirname, '/dist'),
      clean: true,
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    devtool: mode === 'development' ? 'inline-source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
        template: './index.html',
        hash: true,
      }),
      new HtmlWebpackInjectPreload({
        files: [
          {
            match: /hero\.webp$/,
            attributes: { as: 'image', media: '(min-width: 800px)' },
          },
          {
            match: /herosmall\.webp$/,
            attributes: { as: 'image', media: '(max-width: 799px)' },
          },
          {
            match: /.*\.woff2$/,
            attributes: { as: 'font', crossorigin: 'anonymous' },
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './public', to: './public' },
          { from: './robots.txt', to: 'robots.txt' },
        ],
      }),
      new Dotenv(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false,
      }),
      new webpack.DefinePlugin({}),
      new ImageMinimizerPlugin({
        exclude: /node_modules/,
        minimizerOptions: {
          plugins: ['mozjpeg'],
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(svg|jpg|gif|mp4)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name].[ext]',
          },
        },
        {
          test: /\.(ttf|woff|woff2)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name].[ext]',
          },
        },
        {
          test: /\b(?!hero\b)\w+\b\.(jpg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name].[ext]',
          },
        },
        {
          test: /hero\.(jpg|webp)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'static/[name].[ext]',
              },
            },
            {
              loader: 'webpack-image-resize-loader',
              options: {
                width: 1320,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: mode === 'development' ? false : true,
      minimizer: [`...`, new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            priority: 20,
          },
          pages: {
            chunks: 'all',
            priority: 10,
          },
        },
      },
    },
  };

  if (mode === 'production') {
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
      })
    );
  }

  config.module.rules.push({
    test: /\.css$/i,
    exclude: /node_modules/,
    use: [
      mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  });

  return config;
};
