Tetra UI
========

A smart, easy-to-use toolkit for creating rich interfaces in lightning speed!
-----------------------------------------------------------------------------

### Working locally with Tetra UI

Here are the instructions to launch and build locally the whole Tetra UI project.

#### Installing Node.js

If it is not already done, install it here:
<http://nodejs.org/>

#### Getting the `tetra-ui` project

You can use the default GitHub client, or your preferred Git client, or the `git` command line.
For testing purpose another solution is to get the repository as a Zip file.

The repository content must be in a `tetra-ui` folder on your computer.

#### Installing required Node packages

With the command line go to the `tetra-ui` folder:

    cd tetra-ui

Since it is better to install packages locally and not system wide:

    npm install

Now you should have a `node_modules` folder inside `tetra-ui` with all the required Node modules.
The `npm`command installs the dependencies located in `package.json`.

#### Launching Tetra UI with Grunt’s built-in server

    grunt watch-server

And then go to this URL in a browser: <http://localhost:8080/> or <http://127.0.0.1:8080/>.

With this `watch-server` task, every time a Less file is changed, Grunt rebuilds the CSS files.

### Slides about Tetra.js & Tetra UI

<http://viadeo.github.com/tetra-slides/2012-11-20/>

Licence
-------
(The MIT License)

Copyright (c) Viadeo/APVO Corp., Frédéric Perrin, Olivier Hory,
Richard Francis, Sylvain Faucherand and other Tetra contributors.

Inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence)

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
