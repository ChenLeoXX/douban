var index = 0
var lock = false
getData()
function getData() {
  if (lock) return
  lock = true
  $('.loading').show()
  $.ajax({
    url: 'http://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
      start: index,
      count: 20
    },
    dataType: 'jsonp',
  }).done(function (data) {
    index += 20
    retData(data)
    lock = false
    $('.loading').hide()
  }).fail(function () {
    console.log('error')
    $('.loading').hide()
    lock = false
  })
}
// 底部tab切换

$('#tabs div').click(function () {
  var index = $(this).index()
  $(this).addClass('active').siblings().removeClass('active')
  $('section').eq(index).fadeIn().siblings().hide()
})
//内容拼接展示
function retData(data) {
  console.log(data.subjects)
  var str =
    `<a href="">
    <div class="film clearfix">
      <div class="pic">
        <img src="http://img7.doubanio.com/view/movie_poster_cover/spst/public/p480747492.jpg" alt="">
      </div>
      <div class="info">
        <h2 class="title">肖申克的救赎</h2>
        <div class="extro">
          <span class="score">9.6</span>
          <span>分</span>
          <span class="clect">/ 1136394</span>收藏
        </div>
        <div class="extro">
          <span class="year">1994 </span>
          <span class="type">/ 犯罪 / 剧情</span>
        </div>
        <div class="extro">
          <span>导演:</span>
          <span class="director">弗兰克·德拉邦特</span>
        </div>
        <div class="extro">
          <span>主演:</span>
          <span class="actor">蒂姆·罗宾斯、摩根·弗里曼、鲍勃·冈顿</span>
        </div>
      </div>
  </a>
  </div>`
  data.subjects.forEach(function (film) {
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
    $node.find('.director').text(film.directors[0].name)
    $('.container').append($node)
  })
}
//监听滚动
$('#content').scroll(function () {
  if ($('.rank').height() - 10 <= $('#content').height() + $('#content').scrollTop() - 20) {
    getData()
  }
})
