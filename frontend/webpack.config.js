const path = require('path');

module.exports = {
  // The entry point where Webpack starts bundling
  entry: './src/server.js',  // Change this to your main JS file if different
  
  // The output configuration for bundled files
  output: {
    filename: 'bundle.js',  // The output bundle file name
    path: path.resolve(__dirname, 'dist'),  // The output directory where the bundle will be saved
  },

  // Module rules for handling different file types
  module: {
    rules: [
      // Rule for handling CSS files
      {
        test: /\.css$/,  // Match .css files
        use: ['style-loader', 'css-loader'],  // Apply the loaders to handle CSS
      },
      // Rule for transpiling JavaScript with Babel
      {
        test: /\.js$/,  // Match .js files
        exclude: /node_modules/,  // Don't transpile files from node_modules
        use: 'babel-loader',  // Use Babel to transpile JavaScript
      },
    ],
  },

  // Extensions to resolve, e.g., .js, .css
  resolve: {
    extensions: ['.js', '.css'],
  },

  // Mode configuration
  mode: 'development',  // Change to 'production' for production builds
};
