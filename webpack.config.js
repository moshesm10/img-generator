module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
      filename: 'bundle.js',
    },
    module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: ['babel-loader'],
          },
      ],
  }
  };