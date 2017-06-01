var request = require('request')
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

function getO2Index () {
  result = []
  request({
    url: 'https://www.ptt.cc/bbs/AllTogether/index3456.html',
    method: 'GET'
  }, function (e, r, b) { /* Callback 函式 */
    /* e: 錯誤代碼 */
    /* b: 傳回的資料內容 */
    if (!e) {
      $ = cheerio.load(b)
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
          href: $(a).children('.title').children('a').attr('href')
        })
      }
      // leave the 徵男
      result = result.filter(r => {
        return r.title.indexOf('[徵男]') !== -1
      })
      for (let r of result) {
        getContent(r)
      }
    }
  })
}

function getContent ({title, author, href}) {
  console.log(href)
  request({
    url: 'http://www.ptt.cc' + href,
    method: 'GET'
  }, function (e, r, b) {
    if (!e) {
      $ = cheerio.load(b)
      let content = $('#main-content').text()
      console.log(content)
    }
  })
}

getO2Index()
