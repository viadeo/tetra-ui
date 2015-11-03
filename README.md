[Tetra UI](http://viadeo.github.io/tetra-ui/doc)
========

> A smart, easy-to-use toolkit for creating rich interfaces in lightning speed!

`MASTER` is the main branch.
To update the staging branch (gh-pages) do `npm run deploy`

## Getting started

Three quick start options are available:

* [Download the latest release](https://github.com/viadeo/tetra-ui/releases).
* Clone the repo: `git clone https://github.com/viadeo/tetra-ui.git`.
* Install with [Bower](http://bower.io): `bower install tetra-ui`.

The main folder you’ll use is of course `tetra-ui` where you’ll find the main files: CSS, web fonts, images, Less, Sass.

## Building Tetra UI

Here are the instructions to launch and build locally the whole Tetra UI project and even the documentation files.

1. Install [Node.js](http://nodejs.org/)
2. Install [Npm](http://npmjs.org/) dependancies (npm should with Node)
3. Install `grunt-cli` globally with `npm install -g grunt-cli`.
4. Install `bower` globally with `npm install -g bower`.

Navigate to the root `tetra-ui` directory and then run `npm install` to install project dependancies.<br />
The `npm`command installs the dependencies defined in `package.json`.

Now you should have a `node_modules` folder inside `tetra-ui` with all the required Node.js modules.

## Launching Tetra UI

`grunt`

And then go to this URL in a browser: <http://localhost:5000/tetra-ui/dist> or <http://127.0.0.1:5000/tetra-ui/dist>.<br />
With this `grunt default` task, every time a Less file is changed, Grunt rebuilds the CSS files.

## Extras

* Tetra-ui is supplied within [Less](http://lesscss.org/) And [Scss](http://sass-lang.com/guide) files.
To convert files, simply run `grunt less2sass`.
* Slides about Tetra.js & Tetra UI. [View Slides](http://viadeo.github.com/tetra-slides/2012-11-20/).

Licence
-------
(The MIT License)

Copyright (c) Viadeo/APVO Corp., Frédéric Perrin, Olivier Hory,
Richard Francis, Sylvain Faucherand and other Tetra contributors.

Inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
