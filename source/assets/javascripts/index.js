import bloom from './viz/bloom'

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
// require('./semantic-ui/sidebar')
// require('./semantic-ui/site')
// require('./semantic-ui/state')
// require('./semantic-ui/sticky')
// require('./semantic-ui/tab')
// require('./semantic-ui/transition')
// require('./semantic-ui/video')
// require('./semantic-ui/visibility')
// require('./semantic-ui/visit')

// ————————————————————————————————
// smooth scrolling
// @see: https://css-tricks.com/snippets/jquery/smooth-scrolling/
// ————————————————————————————————
// function _scrollSmoothly() {
//   $('a[href*="#"]:not([href="#"])').click(function () {
//     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
//       let target = $(this.hash)
//       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//       if (target.length) {
//         $('html, body').animate({
//           scrollTop: target.offset().top
//         }, 2000)
//         return false }}})}


function _resize() {}
function _scroll() {}


$(document)
  .ready(function () {
    console.log('ready')
    // _scrollSmoothly()
    bloom('#bloom', 5)
    // _.defer(() => {
    //   _resize()
    //   _scroll()
    //   // attach window handlers
    //   $(window).on('resize', _.debounce(() => _resize(), 120))
    //   $(window).on('scroll', () => { _scroll() })
  })

