const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        "browser": "./browser"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: "./index.html",
            chunks: ["browser"]
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "./"),
        port: 3030
    }
}
