import SVGMorpheus from './svg-morpheus'
import principles from './principles'
import team from './team'
import fancyHeader from './viz/fancy-header'
import project from './viz/project'
import bloom from './viz/bloom'
import splat from './splat/splat'
import loopScroll from './viz/loop-scroll'

require('./semantic-ui/accordion')
// require('./semantic-ui/api')
// require('./semantic-ui/checkbox')
// require('./semantic-ui/colorize')
require('./semantic-ui/dimmer')
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
require('./semantic-ui/site')
require('./semantic-ui/state')
// require('./semantic-ui/sticky')
// require('./semantic-ui/tab')
require('./semantic-ui/transition')
// require('./semantic-ui/video')
require('./semantic-ui/visibility')
require('./semantic-ui/visit')

let Rellax = require('rellax')



// ————————————————————————————————
// smooth scrolling
// @see: https://css-tricks.com/snippets/jquery/smooth-scrolling/
// ————————————————————————————————
function _scrollSmoothly() {
  $('a[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      let target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
}

// menu
// ————————————————————————————————
function _menu() {

  // no menu
  if ($('#sidebar').length === 0) return

  let tocOptions = {iconId:   'burger',
                    duration: 400,
                    rotation: 'none' },
      tocButton  = new SVGMorpheus('#toc > #iconset', tocOptions)

  $('#sidebar')
    // .sidebar('setting', 'transition', 'overlay')
    .sidebar({
      onVisible: () => {
        tocButton.to('close')
        $('#toc').addClass('open') },
      onHide: () => {
        tocButton.to('burger')
        $('#toc').removeClass('open') }})
    .sidebar('attach events', '#toc')
    .sidebar('attach events', '#sidebar > a')
}

function _projects() {
  $('.project').each((ι, η) => { project(η, ι) }) }

function _parallax() {
  new Rellax('.rellax', { center: true })
}


function _splat() {
  $('.splat').each((ι, η) => {
    console.log('initialize splat', ι, η)
    splat(η)
  })
}

$(document)
  .ready(function () {
    _menu()
    // _scrollSmoothly()
    team.init('.core.team.member')
    fancyHeader('.fancy')
    _parallax()
    _splat()
    // loopScroll('.pusher', '.segment')

    bloom('#bloom', '.bloom.segment')
    // principles.init('#principles')

  })


if (__DEVELOPMENT__) {
  console.log("Running in development mode!");
}

if (__DEBUG__) {
  console.log("Running in debug mode!");
}

if (__BUILD__) {
  console.log("Welcome to bee two");
}
