module.exports = {
    mode: 'development',
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