/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var top = __webpack_require__(1)
var usa = __webpack_require__(2)
var search = __webpack_require__(3)

top.init($('.movie-list'),'http://api.douban.com/v2/movie/top250',8,$('.movie-container'))
usa.init($('.usa-movie'),'http://api.douban.com/v2/movie/us_box',20,$('.usa-container'))
search.init($('.search'),'http://api.douban.com/v2/movie/search',$('.search-movie'))

/***/ }),
/* 1 */
/***/ (function(module, exports) {


var Top250 = (function(){
    function _moblieDouban($ct,url,num,element){
        this.$ct = $ct
        this.url = url
        this.num = num
        this.element = element
        this.$footer = $('footer .footer-container')
        this.$div = $('section>div')
        this.initBind()
        this.init()
        this.bind()
        this.start()
    }
    _moblieDouban.prototype.init = function(){
        var _this = this
        this.clock = false
        this.index = 0
    }

    _moblieDouban.prototype.initBind = function(){
        var _this = this
        _this.$footer.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active')
            _this.$div.hide().eq($(this).index()).fadeIn(500)
        })
    }

    _moblieDouban.prototype.bind = function(){
        var _this = this
        _this.$ct.scroll(function(){
            if(_this.isloading($(this))){
                _this.start()
            }
        })
    }

    _moblieDouban.prototype.start = function(){
        var _this = this
        _this.getData(_this.url,function(news){
            _this.appendHtml(news,_this.element)
        },_this.num)
    }

    _moblieDouban.prototype.getData= function(url,callback,num){
        var _this = this
        if(_this.clock) return false;
        _this.clock = true
        _this.$ct.find('.none').show()
        $.ajax({
            url:url,
            method:"GET",
            data:{
                start:_this.index || 0,
                count:num
            },
            dataType:'jsonp'
        }).done(function(ret){
            console.log(ret)
            callback(ret)
            _this.index += num
        }).fail(function(){
            console.log('fail')
        }).always(function(){
            _this.clock = false
            _this.$ct.find('.none').hide()
        })
    }

    _moblieDouban.prototype.appendHtml = function(news){
        var _this = this
        news.subjects.forEach(function(node){
            var content =`<li class="item clear">
                           <a href="">
                               <div class="image">
                                   <img src="" alt="">
                               </div>
                               <div class="message">
                                   <h4></h4>
                                   <p>
                                       <span class="mark"></span>
                                       <span class="collection"></span>
                                   </p>
                                   <p>
                                       <span class="year"></span>
                                       <span class="genres"></span>
                                   </p>
                                   <p>
                                       <span class="director"></span>
                                   </p>
                                   <p>
                                       <span class="stars"></span>
                                   </p>
                               </div>
                           </a>
                       </li>`
            var data = $(content)
            data.find('a').attr('href',node.alt)
            data.find('.image>img').attr('src',node.images.small)
            data.find('.message>h4').text(node.title)
            data.find('.message .mark').text(node.rating.average+'分'+'\n'+'\n'+'/')
            data.find('.message .collection').text(node.collect_count+'收藏')
            data.find('.message .year').text(node.year)

            data.find('.message .genres').text(function(){
                var arr = []
                node.genres.forEach(function(news){
                    arr.push(news)
                })
                return arr.join('/')
            })

            data.find('.message .director').text(node.name)

            data.find('.message .stars').text(function(){
                var arr = []
                node.casts.forEach(function(news){
                    arr.push(news.name)
                })
                return arr.join('/')
            })

            _this.element.append(data)
        })
    }

    _moblieDouban.prototype.isloading = function($this){
        var _this = this
        return $this.height()+$this.scrollTop() === _this.$ct.find('.list-wrap').height()

}
return {
    init : function($ct,url,num,element){
        new _moblieDouban($ct,url,num,element)
    }
}
})()
var top = Top250
module.exports = top


/***/ }),
/* 2 */
/***/ (function(module, exports) {





var usaData = (function(){
    function _moblieDouban($ct,url,num,element){
        this.$ct = $ct
        this.url = url
        this.num = num
        this.element = element
        this.$footer = $('footer .footer-container')
        this.$div = $('section>div')
        this.init()
        this.bind()
        this.start()
    }
    _moblieDouban.prototype.init = function(){
        var _this = this
        this.clock = false
        this.index = 0
    }

    _moblieDouban.prototype.bind = function(){
        var _this = this

    }

    _moblieDouban.prototype.start = function(){
        var _this = this
        _this.getData(_this.url,function(news){
            _this.appendHtml(news,_this.element)
        },_this.num)
    }

    _moblieDouban.prototype.getData= function(url,callback,num){
        var _this = this
        if(_this.clock) return false;
        _this.clock = true
        _this.$ct.find('.none').show()
        $.ajax({
            url:url,
            method:"GET",
            data:{
                start:_this.index || 0,
                count:num
            },
            dataType:'jsonp'
        }).done(function(ret){
            console.log(ret)
            callback(ret)
            _this.index += num
        }).fail(function(){
            console.log('fail')
        }).always(function(){
            _this.clock = false
            _this.$ct.find('.none').hide()
        })
    }

    _moblieDouban.prototype.appendHtml = function(news){
        var _this = this
        news.subjects.forEach(function(node){
            node = node.subject
            var content =`<li class="item clear">
                           <a href="">
                               <div class="image">
                                   <img src="" alt="">
                               </div>
                               <div class="message">
                                   <h4></h4>
                                   <p>
                                       <span class="mark"></span>
                                       <span class="collection"></span>
                                   </p>
                                   <p>
                                       <span class="year"></span>
                                       <span class="genres"></span>
                                   </p>
                                   <p>
                                       <span class="director"></span>
                                   </p>
                                   <p>
                                       <span class="stars"></span>
                                   </p>
                               </div>
                           </a>
                       </li>`
            var data = $(content)
            data.find('a').attr('href',node.alt)
            data.find('.image>img').attr('src',node.images.small)
            data.find('.message>h4').text(node.title)
            data.find('.message .mark').text(node.rating.average+'分'+'\n'+'\n'+'/')
            data.find('.message .collection').text(node.collect_count+'收藏')
            data.find('.message .year').text(node.year)

            data.find('.message .genres').text(function(){
                var arr = []
                node.genres.forEach(function(news){
                    arr.push(news)
                })
                return arr.join('/')
            })

            data.find('.message .director').text(node.name)

            data.find('.message .stars').text(function(){
                var arr = []
                node.casts.forEach(function(news){
                    arr.push(news.name)
                })
                return arr.join('/')
            })

            _this.element.append(data)
        })
    }

    return {
        init : function($ct,url,num,element){
            new _moblieDouban($ct,url,num,element)
        }
    }
})()
var usa = usaData
module.exports = usa

/***/ }),
/* 3 */
/***/ (function(module, exports) {


var searchData = (function(){
    function _moblieDouban($ct,url,element){
        this.$ct = $ct
        this.url = url
        this.value = ''
        this.element = element
        this.init()
        this.bind()
    }
    _moblieDouban.prototype.init = function(){
        var _this = this
        this.clock = false
        this.index = 0
    }

    _moblieDouban.prototype.bind = function(){
        var _this = this
        this.$ct.find('.btn').on('click',function(){
            _this.value = _this.$ct.find('input').val()
            _this.start()
        })

    }

    _moblieDouban.prototype.start = function(){
        var _this = this
        _this.getData(_this.url,function(news){
            _this.appendHtml(news,_this.element)
        })
    }

    _moblieDouban.prototype.getData= function(url,callback){
        var _this = this
        if(_this.clock) return false;
        _this.clock = true
        _this.$ct.find('.none').show()
        $.ajax({
            url:url,
            method:"GET",
            data:{
                q:_this.value
            },
            dataType:'jsonp'
        }).done(function(ret){
            console.log(ret)
            callback(ret)
        }).fail(function(){
            console.log('fail')
        }).always(function(){
            _this.clock = false
            _this.$ct.find('.none').hide()
        })
    }

    _moblieDouban.prototype.appendHtml = function(news){
        var _this = this
        news.subjects.forEach(function(node){
            var content =`<li class="item clear">
                           <a href="">
                               <div class="image">
                                   <img src="" alt="">
                               </div>
                               <div class="message">
                                   <h4></h4>
                                   <p>
                                       <span class="mark"></span>
                                       <span class="collection"></span>
                                   </p>
                                   <p>
                                       <span class="year"></span>
                                       <span class="genres"></span>
                                   </p>
                                   <p>
                                       <span class="director"></span>
                                   </p>
                                   <p>
                                       <span class="stars"></span>
                                   </p>
                               </div>
                           </a>
                       </li>`
            var data = $(content)
            data.find('a').attr('href',node.alt)
            data.find('.image>img').attr('src',node.images.small)
            data.find('.message>h4').text(node.title)
            data.find('.message .mark').text(node.rating.average+'分'+'\n'+'\n'+'/')
            data.find('.message .collection').text(node.collect_count+'收藏')
            data.find('.message .year').text(node.year)

            data.find('.message .genres').text(function(){
                var arr = []
                node.genres.forEach(function(news){
                    arr.push(news)
                })
                return arr.join('/')
            })

            data.find('.message .director').text(node.name)

            data.find('.message .stars').text(function(){
                var arr = []
                node.casts.forEach(function(news){
                    arr.push(news.name)
                })
                return arr.join('/')
            })

            _this.element.append(data)
        })
    }

    return {
        init : function($ct,url,element){
            new _moblieDouban($ct,url,element)
        }
    }
})()

var search = searchData

module.exports = search

/***/ })
/******/ ]);