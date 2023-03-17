const path = require('path');

module.exports = {
    entry: './src/Main.ts',
    devtool: 'inline-source-map',
    output: {
        filename: 'script4.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 8080,
        allowedHosts: ['all'],
    }
};