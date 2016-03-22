# LineUp Remote Data Provider Test

This repository contains a sample setup for using the [RemoteDataProvider](https://github.com/Caleydo/lineup.js/blob/master/src/provider.ts#L927) of [LineUp.js] (https://github.com/Caleydo/lineup.js).

## Setup

```bash

npm install
bower install

node index.js
```

## Description

A express node server serves the website (stored in the public directory) and provides access to the ranking data stored in a Sqlite database. The code is not optimized for caching and lacks of sql injection vulnerabilities. It is a proof of concept how the RemoteDataProvider can be used.

## Important Files

 * `index.js` contains the server side implemenation using Sqlite as storage backend
 * `public/main.js` the JavaScript code for defining the interface to the server side
