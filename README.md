# WordPress Dev Server

WordPress development made easy.

### CLI Configuration

- `-p` or `--port`: _default_: `8080`
  - The port on which you can preview your changes
- `-h` or `--host`: _default_: `localhost`
  - The host on which you can preview your changes
- `-P` or `--proxy`: _default_: `http://localhost:8000`
  - The URL (include _http://_) on which your local WordPress installation runs on.
  - If you are only making small changes to an no-local website css and js should get hot-loaded anyway.
- `--publicPath`: _default_: `/wp-content/themes/FOLDER_BASENAME`
  - The path where your proxied files are available.

### Config File Configuration

To configure wpds-scripts you need to create the `wpds-scripts.config.js` file inside your project root folder.

Inside it you can override the following options from the default config:

```JavaScript
{
  verbose: false, // boolean -> set to true to recieve more console logs
  port: 8080, // number -> dev server port
  host: "localhost", // string -> dev server hostname
  proxy: "http://localhost:8000", // string -> the URL to which the dev server will redirect to (include the http protocol!)
  publicPath: `/wp-content/themes/${path.basename(process.cwd())}`, // string -> the path where your files are exposed to public
  entryFiles: [`${process.cwd()}/src/javascripts/main.js`], // array of strings -> files which are getting bundled (import stylesheets from withing those files, don't load them here!)
  customRules: [], // array -> custom rules that should be added to webpack
  customExternals: [], // array -> custom external dependencies that webpack should ignore when bundling (@wordpress/** packages are already ignored)
  customWebpackConfig: false, // object | false -> object that will override the webpack config (only use this if the above configurations do not suffice!)
  customWebpackDevConfig: false // object | false -> object that will override the webpack dev server config (only use this if the above configurations do not suffice!)
}
```

**Example:**

```JavaScript
module.exports = {
  verbose: true,
  port: 8081,
}
```

> Note: The CLI parameters will always override configuration from your `wpds-scripts.config.js` file.

## Donate

You can buy me a cup of coffee, if you'd like ^^

[![Donate](https://www.paypalobjects.com/en_US/CH/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AXJFXBX8XLYXQ&source=url)
