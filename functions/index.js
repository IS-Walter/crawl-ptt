var functions = require('firebase-functions')
var request = require('request')
var cheerio = require('cheerio')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!')
})

exports.crawlPttO2 = functions.https.onRequest((req, res) => {
  let data = {}
  request({
    url: 'https://www.ptt.cc/bbs/AllTogether/index.html',
    method: 'GET'
  }, function (e, r, b) { /* Callback 函式 */
    /* e: 錯誤代碼 */
    /* b: 傳回的資料內容 */
    console.log(b)
    data = b
  })
  res.send(data)
})
