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
}

function getO2Index () {
  result = []
  request({
    url: 'https://www.ptt.cc/bbs/AllTogether/index.html',
    method: 'GET'
  }, function (e, r, b) { /* Callback 函式 */
    /* e: 錯誤代碼 */
    /* b: 傳回的資料內容 */
    if (!e) {
      $ = cheerio.load(b)
      let titles = $('.r-ent .title')
      let authors = $('.r-ent .author')
      let hrefs = $('.r-ent .title a')
      let links = $('#action-bar-container .btn-group-paging a')

      // parse total pages
      links.map(function (idx, l) {
        if ($(l).text().indexOf('上頁') !== -1) {
          parsePage($, l)
        }
      })

      for (let i = 0; i < titles.length; i++) {
        result.push({
          title: $(titles[i]).text().trim(),
          author: $(authors[i]).text().trim(),
          href: $(hrefs[i]).attr('href')
        })
      }
      // leave the 徵男
      result = result.filter(r => {
        return r.title.indexOf('[徵男]') !== -1
      })
      // console.log(result)
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
