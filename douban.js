// var index = 0
// var lock = false
// getData()
// function getData() {
// if (lock) return
// lock = true
// $('.loading').show()
// $.ajax({
//   url: 'https://api.douban.com/v2/movie/top250',
//   type: 'GET',
//   data: {
//     start: index,
//     count: 20
//   },
//   dataType: 'jsonp',
// }).done(function (data) {
//   index += 20
//   retData(data)
//   lock = false
//   $('.loading').hide()
// }).fail(function () {
//   console.log('error')
//   $('.loading').hide()
//   lock = false
// })
// }
// // 底部tab切换
// $('#tabs div').click(function () {
//   var index = $(this).index()
//   $(this).addClass('active').siblings().removeClass('active')
//   $('section').eq(index).fadeIn().siblings().hide()
// })
// //内容拼接展示
// function retData(data) {
//   console.log(data.subjects)
// var str =
//   `<a href="">
//   <div class="film clearfix">
//     <div class="pic">
//       <img src="http://img7.doubanio.com/view/movie_poster_cover/spst/public/p480747492.jpg" alt="">
//     </div>
//     <div class="info">
//       <h2 class="title">肖申克的救赎</h2>
//       <div class="extro">
//         <span class="score">9.6</span>
//         <span>分</span>
//         <span class="clect">/ 1136394</span>收藏
//       </div>
//       <div class="extro">
//         <span class="year">1994 </span>
//         <span class="type">/ 犯罪 / 剧情</span>
//       </div>
//       <div class="extro">
//         <span>导演:</span>
//         <span class="director">弗兰克·德拉邦特</span>
//       </div>
//       <div class="extro">
//         <span>主演:</span>
//         <span class="actor">蒂姆·罗宾斯、摩根·弗里曼、鲍勃·冈顿</span>
//       </div>
//     </div>
// </a>
// </div>`
//   data.subjects.forEach(function (film) {
//   var $node = $(str)
//   var actor = ''
//   film.casts.forEach(function (act) {
//     actor += act.name + '、'
//     return actor
//   })
//   $node.find('.pic img').attr('src', film.images.medium)
//   $node.find('.title').text(film.title)
//   $node.find('.year').text(film.year)
//   $node.find('.score').text(film.rating.average)
//   $node.find('.clect').text(film.collect_count)
//   $node.find('.type').text(film.genres.join(' /'))
//   $node.find('.actor').text(actor.slice(0, -1))
//   $node.find('.director').text(film.directors[0].name)
//   $('.container').append($node)
// })
// }
// //监听滚动
// $('#content').scroll(function () {
//   if ($('.rank').height() - 10 <= $('#content').height() + $('#content').scrollTop() - 20) {
//     getData()
//   }
// })

// 模块化代码
var app = {
  innit: function () {
    this.$tab = $('#tabs div')
    this.$pannels = $('section')
    this.bind()
    this.start()
  },
  bind: function () {
    var _this = this
    this.$tab.click(function () {
      $(this).addClass('active').siblings().removeClass('active')
      _this.$pannels.eq($(this).index()).fadeIn().siblings().hide()
    })
  },
  start: function () {
    top250.innit()
    usRank.innit()
    searchMovie.innit()
  }
}

var top250 = {
  innit: function () {
    this.index = 0
    this.lock = false
    this.$wrap = $('.rank')
    this.$ct = $('.container')
    this.getData()
    this.bind()
  },
  getData: function () {
    var _this = this
    if (this.lock) return
    if (!(this.index >= 0 && this.index <= 250)) return
    this.lock = true
    $('.loading').show()
    $.ajax({
      url: 'https://api.douban.com/v2/movie/top250',
      type: 'GET',
      data: {
        start: _this.index,
        count: 20
      },
      dataType: 'jsonp',
    }).done(function (data) {
      console.log(data)
      _this.index += 20
      _this.render(data)
      _this.lock = false
      $('.loading').hide()
    }).fail(function () {
      console.log('error')
      $('.loading').hide()
      _this.lock = false
    })
  },
  bind: function () {
    let _this = this
    this.$wrap.scroll(function () {
      if (_this.$ct.height() <= _this.$wrap.height() + _this.$wrap.scrollTop() + 10) {
        _this.getData()
      }
    })
  },
  render: function (data) {
    var _this = this
    data.subjects.forEach(function (film) {
      _this.$ct.append(createNode.Node(film))
    })
  }
}

// 北美票房
var usRank = {
  innit: function () {
    this.$usRank = $('.us-rank')
    this.getData()
  },
  getData: function () {
    var _this = this
    $('.loading').show()
    $.ajax({
      url: 'https://api.douban.com/v2/movie/us_box',
      type: 'GET',
      dataType: 'jsonp',
    }).done(function (data) {
      console.log(data)
      _this.render(data)
      $('.loading').hide()
    }).fail(function () {
      console.log('error')
      $('.loading').hide()
    })
  },
  render: function (data) {
    var _this = this
    data.subjects.forEach(function (film) {
      _this.$usRank.append(createNode.Node(film.subject))
    })
  }
}

//搜索电影
var searchMovie = {
  innit: function () {
    this.$searchBtn = $('.search-btn')
    this.$searchIpt = $('.search-box')
    this.$searchPage = $('.us-ct')
    this.bind()
  },
  getData: function () {
    var _this = this
    //清空页面条目
    if (_this.$searchPage.children().length > 0) {
      _this.$searchPage.empty()
    }
    $('.loading').show()
    $.ajax({
      url: "https://api.douban.com/v2/movie/search",
      type: 'GET',
      data: {
        tag: _this.$searchIpt.val(),
        q: _this.$searchIpt.val()
      },
      dataType: 'jsonp'
    }).done(function (data) {
      $('.loading').hide()
      console.log(data)
      _this.render(data)
    })
  },
  bind: function () {
    var _this = this
    this.$searchBtn.click(function () {
      _this.getData()
    })
  },
  render: function (data) {
    var _this = this
    if(data.total === 0) {
      return this.$searchPage.html('<h2 style=text-align:center;margin-top:50px;>未搜索到相关结果~请换个关键词</h2>')
    }
    data.subjects.forEach(function (film) {
        _this.$searchPage.append(createNode.Node(film))
    })
  }
}
//拼接字符串
var createNode = {
  Node: function (film) {
    var str =
      `<a href>
    <div class="film clearfix">
      <div class="pic">
        <img src="http://img7.doubanio.com/view/movie_poster_cover/spst/public/p480747492.jpg" alt="">
      </div>
      <div class="info">
        <h2 class="title"></h2>
        <div class="extro">
          <span class="score">9.6</span>
          <span>分</span>
          <span class="clect">/ 1136394</span>收藏
        </div>
        <div class="extro">
          <span class="year">1994 </span>
          <span class="type"></span>
        </div>
        <div class="extro">
          <span>导演:</span>
          <span class="director"></span>
        </div>
        <div class="extro">
          <span>主演:</span>
          <span class="actor"></span>
        </div>
      </div>
  </a>
  </div>`
    var $node = $(str)
    var actor = ''
    film.casts.forEach(function (act) {
      actor += act.name + '、'
      return actor
    })
    $node.find('.pic img').attr('src', film.images.medium)
    $node.find('.title').text(film.title)
    $node.find('.year').text(film.year)
    $node.find('.score').text(film.rating.average)
    $node.find('.clect').text(film.collect_count)
    $node.find('.type').text(film.genres.join(' /'))
    $node.find('.actor').text(actor.slice(0, -1))
    $node.find('a').attr('href',''+film.alt)
    $node.find('.director').text(function () {
      if (film.directors[0] !== undefined) {
        return film.directors[0].name
      } else {
        return '未知'
      }
    })
    return $node
  }
}
app.innit()