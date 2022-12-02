const path = require('path');


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        vehicle: './src/vehicle.ts',
        main: './src/main.ts',
        utils: './src/utils.ts',
        Storage: './src/Storage.ts',
        cars: './src/cars.ts',
        trucks: './src/trucks.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
            publicPath: '/',
        }
    },
};