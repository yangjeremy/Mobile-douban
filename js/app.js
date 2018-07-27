var top = require('./Top250.js')
var usa = require('./usaData.js')
var search = require('./searchData.js')

top.init($('.movie-list'),'//api.douban.com/v2/movie/top250',8,$('.movie-container'))
usa.init($('.usa-movie'),'//api.douban.com/v2/movie/us_box',20,$('.usa-container'))
search.init($('.search'),'//api.douban.com/v2/movie/search',$('.search-movie'))