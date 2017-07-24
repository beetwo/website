import bloom      from './viz/bloom'
import menu       from './menu'
import imageGrid  from './viz/image-grid'
import {select}   from 'd3-selection'

// import Waypoint from 'waypoints/lib/jquery.waypoints.js'
require('waypoints/lib/jquery.waypoints.js')

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

function _sticky() {
  let waypoint = new Waypoint({
    element: document.getElementById('main-headline'),
    handler: function(direction) {
      if(direction === 'up') 
        select(this.element)
          .style('position', 'unset')
          .style('top', 'unset')
          .attr('class', '')

      if(direction === 'down') 
        select(this.element)
          .style('position', 'fixed')
          .style('top', '8px')
          .attr('class', 'sticky')
    }, offset: 16 })}

function _resize() {}
function _scroll() {}

$(document)
  .ready(function () {

    // resetting the window scroll prevents a sticky/waypoint-bug
    // that ocurrs when the side is being reloaded after scrolling
    window.scrollTo(0, 0)
    
    _scrollSmoothly()
    menu.init()
    imageGrid.init()
    
    bloom('#bloom', 5)

    _.delay(_sticky, 200)
  })

