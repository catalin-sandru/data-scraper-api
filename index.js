const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 5000;

app.get('/', (req, res, next) => {
  res.json('welcome')
})

app.listen(port, () => {
  console.log(`server runing on port ${port}`)
})