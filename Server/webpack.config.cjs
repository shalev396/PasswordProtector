const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Function to find all handler files recursively
function findHandlers(dir, basePath = "") {
  const handlers = {};
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      Object.assign(
        handlers,
        findHandlers(fullPath, path.join(basePath, item))
      );
    } else if (item.endsWith(".ts") && !item.endsWith(".d.ts")) {
      // Create entry name: auth/login, passwords/create, etc.
      const entryName = basePath
        ? `${basePath}/${path.parse(item).name}`
        : path.parse(item).name;
      handlers[entryName] = fullPath;
    }
  });

  return handlers;
}

// Find all handlers in the src/handlers directory
const handlersDir = path.resolve(__dirname, "src", "handlers");
const handlers = findHandlers(handlersDir);

console.log("Found handlers:", Object.keys(handlers));

// Create webpack entries from handlers
const entries = {};
Object.keys(handlers).forEach((entryName) => {
  entries[entryName] = handlers[entryName];
});

module.exports = {
  mode: "production",
  target: "node",

  // Multiple entry points - one for each handler
  entry: entries,

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].mjs",
    library: {
      type: "module",
    },
    clean: true,
  },

  resolve: {
    extensions: [".ts", ".js", ".json"],
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },

  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: "esnext",
                target: "es2020",
                moduleResolution: "node",
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
                resolveJsonModule: true,
                sourceMap: false,
                declaration: false,
                declarationMap: false,
                removeComments: true,
                isolatedModules: true,
                skipLibCheck: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  // Bundle ALL dependencies - no externals needed
  // The createRequire polyfill handles any CommonJS compatibility issues
  externals: [],

  plugins: [
    new CleanWebpackPlugin(),

    // Add a banner to make require() available in ES modules
    new webpack.BannerPlugin({
      banner: `import {createRequire} from 'module';const require=createRequire(import.meta.url);`,
      raw: true,
    }),
  ],

  optimization: {
    minimize: true,
    // Don't split chunks - each handler should be self-contained
    splitChunks: false,
  },

  performance: {
    hints: false,
  },

  stats: {
    warnings: false,
  },

  // Disable source maps for production
  devtool: false,
};
