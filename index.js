const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.port || 5000;

const websites = [{
  name: 'thetimes',
  address: 'https://www.thetimes.co.uk/environment/climate-change',
  base: ''
},{
  name: 'theguardian',
  address: 'https://www.theguardian.com/environment/climate-crisis',
  base: ''
},{
  name: 'telegraph',
  address: 'https://www.telegraph.co.uk/climate-change',
  base: 'http://www.telegraph.co.uk'
}]
const articles = []

app.get('/', (req, res, next) => {
  res.json('welcome')
})

websites.forEach(website => {
  axios.get(website.address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      $('a:contains("climate")', html).each(function() {
        const title = $(this).text()
        const url = $(this).attr('href')
        articles.push({
          title,
          url: website.base + url,
          source: website.name
        })
      })
    })
    .catch(err => console.log('error'))
})

app.get('/news', (req, res) => {
  res.json(articles)
})

app.get('/news/:websiteId', (req, res) => {
  const websiteId = req.params.websiteId
  const websiteAddress = websites.filter(w => w.name == websiteId)[0].address
  const websiteBase = websites.filter(w => w.name == websiteId)[0].base
  
  axios.get(websiteAddress)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const specificArticles = []

      $('a:contains("climate")', html).each(function() {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
          title,
          url: websiteBase + url,
          source: websiteId
        })
      })
      res.json(specificArticles)
    })
    .catch()
})

app.listen(port, () => {
  console.log(`server runing on port ${port}`)
})