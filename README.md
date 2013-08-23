Tetra UI
========

> A smart, easy-to-use toolkit for creating rich interfaces in lightning speed!

There are two processes to use Tetra UI: either just install it as a dependancy in your project, or build it from source.

## Using Tetra UI

The best way to just use Tetra UI is to install it as a **Bower** module.

You must have Node.js and Bower installed globally. If it isn’t already done, Node.js is here: <http://nodejs.org/>

Then, if you haven’t installed Bower before:

```bash
npm install -g bower
```

On Mac OS X this command must be executed as an admin:

```bash
sudo npm install -g bower
```

### Installing Tetra UI as a bower package

With the command line go to the folder of your project:

```bash
cd my-project
```

Then install the Tetra UI Bower package:

```bash
bower install tetra-ui
```

Now you should have a `bower_components` folder with these three folders:

- json2
- tetra-js
- tetra-ui

The main folder you’ll use is of course `tetra-ui` where you’ll find the main files: CSS, web fonts, images, JavaScript, Less. The folders `tetra-js` and `json2` are required when using Tetra JS components.

## Building Tetra UI

Here are the instructions to launch and build locally the whole Tetra UI project and even the documentation files.

### Installing Node.js

If it is not already done, install it here:
<http://nodejs.org/>

### Installing npm dependancies

Only two Node.js npm modules must be installed globally: Grunt and Bower.

```bash
npm install -g grunt-cli
npm install -g bower
```

On Mac OS X these commands must be executed as an admin:

```bash
sudo npm install -g grunt-cli
sudo npm install -g bower
```

### Getting the `tetra-ui` project

You can use the default GitHub client, your preferred Git client, or the `git` command line.

For testing purpose another solution is to get the repository as a Zip file from GitHub: <https://github.com/viadeo/tetra-ui/releases>

The repository content must be in a `tetra-ui` folder on your computer.

### Installing local Node.js packages

With the command line go to the `tetra-ui` folder:

```bash
cd tetra-ui
```

To install local dependancies:

```bash
npm install
```

The `npm`command installs the dependencies defined in `package.json`.

Now you should have a `node_modules` folder inside `tetra-ui` with all the required Node.js modules.

### Launching Tetra UI with Grunt’s built-in server

```bash
grunt watch-server
```

And then go to this URL in a browser: <http://localhost:8080/> or <http://127.0.0.1:8080/>.

With this `watch-server` task, every time a Less file is changed, Grunt rebuilds the CSS files.

## Slides about Tetra.js & Tetra UI

<http://viadeo.github.com/tetra-slides/2012-11-20/>

Licence
-------
(The MIT License)

Copyright (c) Viadeo/APVO Corp., Frédéric Perrin, Olivier Hory,
Richard Francis, Sylvain Faucherand and other Tetra contributors.

Inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
