
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
