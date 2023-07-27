[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![React](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![React](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![React](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3schools.com/css/)
[![NPM](https://img.shields.io/badge/DEV-Jameshsu1125-9cf?style=for-the-badge)](https://www.npmjs.com/~jameshsu1125)

<p align="center">
  <a href="https://github.com/jameshsu1125">
    <img src="https://user-images.githubusercontent.com/70932507/188534539-a68734ac-9330-4fe0-bc49-5fa85116493e.png" alt="Logo" width=72 height=72>
  </a>
  <h3 align="center">Logo</h3>
  <p align="center">
    Short description   
  </p>
</p>

## Table of contents

- [Table of contents](#table-of-contents)
- [Quick start](#quick-start)
- [Status](#status)
- [What's included](#whats-included)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Contributing](#contributing)
- [Creators](#creators)
- [Thanks](#thanks)
- [Copyright and license](#copyright-and-license)
- [remove optimized svg](#remove-optimized-svg)

## Quick start

- install module

```sh
$ npm i
```

- start project

```sh
$ npm start
```

- build static file to `/dist`

```sh
$ npm run build
```

## Status

- Development since January 2022
- use React hook
- use Less.js
- use ESLint [airbnb](https://github.com/airbnb/javascript) rules
- There is a unit related style will use [TailwindCSS](https://tailwindcss.com/docs/padding)(Spacing, Typography...)

## What's included

- `public` folder will copy to `/dist`
- `src` folder is reactJs entry point. default file is named as `index.js`
- `template` folder is html template for each entry points.

```text
📦package
 ┣ 📂public
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┣ 📂hooks
 ┃ ┣ 📂index
 ┃ ┣ 📂pages
 ┃ ┣ 📂setting
 ┃ ┗ 📜index.js
 ┣ 📂template
 ┃ ┣ 📜template.html
 ┃ ┗ 📜template.meta.js
 ┣ 📜.babelrc
 ┣ 📜.browserslistrc
 ┣ 📜.env.defaults
 ┣ 📜.eslintignore
 ┣ 📜.eslintrc.json
 ┣ 📜.gitattributes
 ┣ 📜.gitignore
 ┣ 📜.prettierignore
 ┣ 📜.prettierrc
 ┣ 📜LICENSE
 ┣ 📜package.json
 ┣ 📜postcss.config.js
 ┣ 📜readme.md
 ┣ 📜tailwind.config.js
 ┗ 📜webpack.config.js
```

## Bugs and feature requests

- [Node](https://nodejs.org/en/) version must be above v16
- I will not maintain when this project is closed

## Contributing

Please read through our [contributing guidelines](https://github.com/github/docs/blob/main/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Moreover, all HTML and CSS should conform to the [Code Guide](https://github.com/airbnb/javascript), maintained by [Main author](https://github.com/jameshsu1125).

## Creators

**maintainer, developer**

- [James Hsu](https://github.com/jameshsu1125)

## Thanks

Thank customers and some manufacturers for their support.

## Copyright and license

Code and documentation copyright 2011-2022 the authors. Code released under the [MIT License](https://reponame/blob/master/LICENSE).

## game rule

```
香菇遊戲說明：
在倒數9~0的九宮格菇田上移動採菇（倒數數字隨機，不會每格都是一樣數字）
也須小心別被竹筍給彈飛（可能會彈進倒數至0的田裡）
遊玩時間越久，菇菇＆竹筍冒出的速度越快、數量越多（隨機出現，皆最多一次出現3朵/支）
掉落到「數字為0的菇田」或「田邊懸崖（*跑動時未及時煞車，角色會落下懸崖）」，遊戲結束

．採菇菇：每採一朵＋1分
．誤碰竹筍：以「倒退嚕」形式被彈開
．靜止3秒：「冒出竹筍」將角色彈開
```

<!-- open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security -->
