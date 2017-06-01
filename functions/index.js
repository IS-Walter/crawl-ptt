var functions = require('firebase-functions')
var request = require('request')
var cheerio = require('cheerio')
var crawl = require('./crawl.js')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!')
})

exports.crawlPttO2 = functions.https.onRequest((req, res) => {
  crawl.init()
  setTimeout(() => {
    let data = crawl.getResult()
    res.send(data)
  }, 2000)
})
