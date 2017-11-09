/* eslint-env node */

'use strict';

require('dotenv').config({silent: true});

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./auth');

const rootPath = path.join(process.cwd());

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
// Serving assets from public folder
app.use(auth);
app.use(express.static(path.join(rootPath, 'dist')));
app.use(express.static(path.join(rootPath, 'public')));

module.exports = app;
