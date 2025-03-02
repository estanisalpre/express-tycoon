const path = require('path'); // Importa el módulo 'path'

module.exports = {
    // Punto de entrada
    entry: './src/index.js',
    
    // Salida
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader', 
                ],
            },
        ],
    },
};

