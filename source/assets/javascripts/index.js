import bloom      from './viz/bloom'
import menu       from './menu'
import imageGrid  from './viz/image-grid'
import slick      from 'slick-carousel'
import dropcap    from 'dropcap.js'
import {select, selectAll} from 'd3-selection'

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
  if($('#main-headline').length === 0) return

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

function _overlayClick() {
  $('.overlay.frame').click(function(e) {
    let isActive  = $(this).hasClass('active'),
        isLink    = $(e.target).is('a')

    if (!isLink) {
      $('.overlay.frame').removeClass('active')
      if(!isActive) $(this).addClass('active')
      e.preventDefault()
      return false  }})}

function _colorChange() {

  function _delay() {
    let delay = _.random(180)
    select(this)
      .style('-webkit-animation-delay', (-delay + 's'))
      .style('animation-delay', (-delay + 's'))}
  
  selectAll('.overlay .content .extra > a').each(_delay)
  selectAll('.overlay .content').each(_delay)
  selectAll('#sidebar').each(_delay)
  selectAll('#sidebar a').each(_delay)
  selectAll('.dropped').each(_delay)
  // selectAll('footer .item a').each(_delay)
  // selectAll('a').each(_delay)
  // selectAll('#toc').each(_delay)
}


function _carousel() {
  $('.carousel').slick({
    arrows: false,
    dots: true,
    infinite: true,
    lazyLoad: 'ondemand',
    autoplay: true,
    autoplaySpeed: 4000,
  })
}

function _dropcap() {
  // @see: https://github.com/adobe-webplatform/dropcap.js
  // Drop cap letters need to be enclosed in an HTML element e.g.:
  //    <p>
  //      <span class="dropcap">T</span>HE Quick Brown Fox...
  //    </p>
  // This is required because the CSS Object Model does not expose write access 
  // to the styling of pseudo-elements like ::first-letter; 
  // until then, explicit markup is preferred in this version.
  selectAll('.dropcap > p')
    .each(function(d) {
      let content = select(this).html(),
          head    = _.head(content),
          tail    = _(content)
                      .tail()
                      .join('')
      select(this).html(`<span class="dropped">${head}</span>${tail}`)})

  let dropcaps = document.querySelectorAll(".dropcap .dropped"); 
  window.Dropcap.layout(dropcaps, 2); 
}

$(document)
  .ready(function () {
    _scrollSmoothly()
    _overlayClick()
    _carousel()
    _dropcap()
    _colorChange()
    menu.init()
    imageGrid.init()
    bloom('#bloom', 5)

    _.delay(_sticky, 200)
  })

