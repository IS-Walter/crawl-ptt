var functions = require('firebase-functions')

var request = require('request-promise-native')
var cheerio = require('cheerio')

let result = []
let content = []
let totalPage = 0

function parsePage ($, el) {
  let str = $(el).attr('href')
  let end = str.indexOf('.html')
  let start = str.indexOf('index')
  totalPage = parseInt(str.slice(start + 5, end))
  console.log('total page =', totalPage)
}

function getSinglePage (pageNo) {
  let url = 'https://www.ptt.cc/bbs/AllTogether/index' + pageNo + '.html' 
  request(url).then(d => {
    $ = cheerio.load(d)
    let articles = $('.r-ent')

    for (let i = 0; i < articles.length; i++) {
      let a = articles[i]
      result.push({
        title: $(a).children('.title').text().trim(),
        author: $(a).children('.meta').children('.author').text().trim(),
        href: $(a).children('.title').children('a').attr('href'),
        content: ''
      })
    }
    // leave the 徵男
    result = result.filter(r => {
      return r.title.indexOf('[徵男]') !== -1
    })
    for (let r of result) {
      getContent(r).then(d => {
        $ = cheerio.load(d)
        r.content = $('#main-content').text()
      }).catch(err => {
        console.log('error when get single content on page', pageNo)
        console.log(err)
      })
    }
  }).catch(err => {
    console.log('error when parsing page', pageNo)
    console.log(err)
  })
}

function getO2Index () {
  result = []
  request('https://www.ptt.cc/bbs/AllTogether/index.html').then(d => {
    $ = cheerio.load(d)
    let articles = $('.r-ent')
    let links = $('#action-bar-container .btn-group-paging a')

    // parse total pages
    links.map(function (idx, l) {
      if ($(l).text().indexOf('上頁') !== -1) {
        parsePage($, l)
      }
    })

    for (let i = 0; i < articles.length; i++) {
      let a = articles[i]
      result.push({
        title: $(a).children('.title').text().trim(),
        author: $(a).children('.meta').children('.author').text().trim(),
        href: $(a).children('.title').children('a').attr('href'),
        content: ''
      })
    }
    // leave the 徵男
    result = result.filter(r => {
      return r.title.indexOf('[徵男]') !== -1
    })
    for (let r of result) {
      getContent(r).then(d => {
        $ = cheerio.load(d)
        r.content = $('#main-content').text()
      }).catch(err => {
        console.log('error when get single content on index')
        console.log(err)
      })
    }
    // parse the previous 6 pages
    for (let i = 1; i < 6; i++) {
      getSinglePage(totalPage-i)
    }

  }).catch(err => {
    console.log('error when parse index')
    console.log(err)
  })
}

function getContent ({href}) {
  let url = 'http://www.ptt.cc' + href
  return request(url)
}

function getResult () {
  return result
}

// getO2Index()
// setTimeout(() => {
//   console.log(getResult())
// }, 2000)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!')
})

exports.crawlPttO2 = functions.https.onRequest((req, res) => {
  let data = []
  getO2Index()
  setTimeout(() => {
    data = getResult()
    console.log(data)
    res.send(JSON.stringify(data))
  }, 2000)
})

exports.testUrl = functions.https.onRequest((req, res) => {
  request('https://www.google.com.tw/search?q=firebase&oq=firebase&aqs=chrome..69i57j69i60l2j69i65j69i60l2.3541j0j4&sourceid=chrome&ie=UTF-8')
  .then(d => {
    res.send(d)
  }).catch(err => {
    console.log('error on testURL')
    console.log(err)
  })
})

exports.testPtt = functions.https.onRequest((req, res) => {
  request('https://www.ptt.cc/bbs/AllTogether/index.html')
  .then(d => {
    res.send(d)
  }).catch(err => {
    console.log('error on testPTT')
    console.log(err)
  })
})
