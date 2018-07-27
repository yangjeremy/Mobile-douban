
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