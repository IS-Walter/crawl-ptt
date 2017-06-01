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

async function getO2Index () {
  result = []
  await request('https://www.ptt.cc/bbs/AllTogether/index3456.html').then(d => {
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
      getContent(r).then(str => {
        // console.log(str)
        r.content = str
      }).catch(err => {
        console.log(err)
      })
    }
  })
  setTimeout(() => {
    console.log(result)
  }, 1000)
}

async function getContent ({href}) {
  let content = ''
  await request('http://www.ptt.cc' + href).then(d => {
    $ = cheerio.load(d)
    content = $('#main-content').text()
  }).catch(err => {
    console.log(err)
  })
  return content
}

getO2Index()
