const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 5000;

const articles = []

app.get('/', (req, res, next) => {
  res.json('welcome')
})

app.get('/news', (req, res) => {
  axios.get('https://www.theguardian.com/environment/climate-crisis')
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    
    $('a:contains("climate")', html).each(function() {
      const title = $(this).text()
      const url = $(this).attr('href')
      articles.push({title, url})
    })
    res.json(articles)
  })
  .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`server runing on port ${port}`)
})