import bloom      from './viz/bloom'
import menu       from './menu'
import imageGrid  from './viz/image-grid'

// require('./semantic-ui/accordion')
// require('./semantic-ui/api')
// require('./semantic-ui/checkbox')
// require('./semantic-ui/colorize')
// require('./semantic-ui/dimmer')
// require('./semantic-ui/dropdown')
// require('./semantic-ui/embed')
// require('./semantic-ui/form')
// require('./semantic-ui/modal')
// require('./semantic-ui/nag')
// require('./semantic-ui/popup')
// require('./semantic-ui/progress')
// require('./semantic-ui/rating')
// require('./semantic-ui/search')
// require('./semantic-ui/shape')
require('./semantic-ui/sidebar')
// require('./semantic-ui/site')
// require('./semantic-ui/state')
// require('./semantic-ui/sticky')
// require('./semantic-ui/tab')
// require('./semantic-ui/transition')
// require('./semantic-ui/video')
// require('./semantic-ui/visibility')
// require('./semantic-ui/visit')

// smooth scrolling
// @see: https://css-tricks.com/snippets/jquery/smooth-scrolling/
// ————————————————————————————————
function _scrollSmoothly() {
  $('a[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      let target = $(this.hash)
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']')
      if (target.length) {
        $('html, body').animate({scrollTop: target.offset().top}, 1400)
        return false }}})}


function _interceptHyperlinks() {
  $('a').click(function(){
    console.log('clickedy click!')
    // prevent the default action:
    // return false
  })
}

function _resize() {}
function _scroll() {}

$(document)
  .ready(function () {
    _scrollSmoothly()
    _interceptHyperlinks()
    
    menu.init()
    imageGrid.init()
    
    bloom('#bloom', 5)
    // _.defer(function() {})
  })

