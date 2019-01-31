const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: './main.js',
    output: {
        library: 'simulation',
        libraryTarget: 'umd',
        filename: 'simulation.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            }
        ]
    },
    externals: [nodeExternals()],
    plugins: [],
    optimization: {
        minimize: true
       // minimizer: [new UglifyJsPlugin()]
    }
};
