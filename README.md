<h1 align="center">
 The Research Support Hub
</h1>

<h5 align="center">
 Created by 1233 CSSWENG S16 Group 10
</h5>

<p align="center">
 <a href="https://github.com/feross/standard"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg"></a>
 <a href="https://opensource.org/license/mit"><img src="https://img.shields.io/github/license/Aspyse/research-support-hub"></a>
</p>

<p align="center">A centralized hub for research-related resources, guidelines, and information</p>

## Setup

Copy the `.env` file into your local project root directory. It will be pinned in our group chat.

Run the following command in Terminal:

```sh
$ npm install
```

Once the node modules are installed, you can now run the `dev` script to launch the web app locally:

```sh
$ npm run dev
```

## Guidelines for Developers

_Please do not skip over this section._

### General

- Please remember to work in your own dev branch.

### JS
 
- We use ES6 modules.
  - `import { express } from 'express'` is correct.
  - `const express = require('express')` is incorrect.
 
- We follow the [Standard](https://github.com/feross/standard) code style. `npm run standard` will automatically format your code.
  - Semicolons are omitted.
  - Tabs are 2 spaces.
  - Single quotes for strings.
  - Etc.

### CSS

- We primarily use `rem` units.
  - `1px` = `0.0625rem`
  - Exception may be made for `px` font sizes.
  - And also `%` for relative sizing.

- Use `var()` for consistency.

## Resources
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting/quickstart)
- [Firebase SDKs](https://firebase.google.com/docs/reference/js)
- [Firebase for Web](https://firebase.google.com/docs/web/setup)
- [StandardJS Rules](https://standardjs.com/rules.html)
