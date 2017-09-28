const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/app/main.js',
    output: {
		path: __dirname + '/dist',
        filename: './app.js'
    },
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						html: 'markup-inline-loader'
					}
				}
			},
			{	
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
			    test: /\.svg/,
			    use: {
			        loader: 'svg-url-loader',
			        options: { }
			    }
			},
			{
				test: /\.(png|jpg|gif|ttf)$/,
				use: {
					loader: 'url-loader',
				}
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" }
				]
			}
		]
	},
	plugins: [
		// delete 'dist' folder on re-build.
		new CleanWebpackPlugin(['dist/']),
		
		// copy.
		new CopyWebpackPlugin([
            { from: './src/main.js', to: './' },
            { from: './src/index.html', to: './' }
		])
	],
	watch: true // configure webpack to watch for changes.
};