import SVGMorpheus from './svg-morpheus'
// import principles from './principles'
import team from './team'
import project from './viz/project'
import bloom from './viz/bloom'
// import splat from './splat/splat'
// import Slack from './slack'
import Cookies from 'js-cookie'

require('slick-carousel')

require('./semantic-ui/accordion')
// require('./semantic-ui/api')
// require('./semantic-ui/checkbox')
// require('./semantic-ui/colorize')
require('./semantic-ui/dimmer')
require('./semantic-ui/dropdown')
// require('./semantic-ui/embed')
require('./semantic-ui/form')
// require('./semantic-ui/modal')
require('./semantic-ui/nag')
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
  $('a[href*="#"]:not([href="#"])').click(() => {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      let target = $(this.hash)
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']')
      if (target.length) {
        $('html, body').animate({scrollTop: target.offset().top}, 1000)
        return false }}})}

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
    .sidebar({
      dimPage: false,
      onVisible: () => {
        tocButton.to('close')
        $('#toc').addClass('open') },
      onHide: () => {
        tocButton.to('burger')
        $('#toc').removeClass('open') }})
    .sidebar('attach events', '#toc')
    .sidebar('attach events', '#sidebar > a')}

function _i18n() {
  // dropdown menu selector
  let ζ = $('.ui.language.dropdown')
  // stop if it ain't there
  if (ζ.length === 0) return
  // init dropdown
  ζ.dropdown({ onChange: (_value, text) => { 
      let host      = window.location.host,
          pathname  = window.location.pathname,
          search    = window.location.search,
          hash      = window.location.hash
      pathname = pathname.replace(/\/(de)/, '')
      if(text === 'de') pathname = pathname + 'de' 
      window.location.pathname = pathname} })
    .dropdown('set text', window.location.href.match(/\/de/) ? 'de' : 'en')}

function _projects() {
  console.log('initializing projects')
  $('.projects').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: true,
    speed: 400,
    responsive: [ { breakpoint: 1919,
                    settings: { slidesToShow: 2 }},
                  { breakpoint: 1199,
                    settings: { slidesToShow: 2 }},
                  { breakpoint: 991,
                    settings: { slidesToShow: 2 } },
                  { breakpoint: 767,
                    settings: { slidesToShow: 1 } }]})}

function _partners() {
  let slickOptions  = { infinite:       true,
                        slidesToScroll: 1,
                        dots:           false,
                        arrows:         false,
                        centerMode:     false,
                        variableWidth:  true,
                        adaptiveHeight: false,
                        autoplay:       true,
                        autoplaySpeed:  0,
                        speed:          12000,
                        cssEase:        'linear',
                        responsive:     [ { breakpoint: 1919,
                                            settings: { slidesToShow: 3 }},
                                          { breakpoint: 1199,
                                            settings: { slidesToShow: 3 }},
                                          { breakpoint: 991,
                                            settings: { slidesToShow: 2 }},
                                          { breakpoint: 767,
                                            settings: { slidesToShow: 1 }}]}
  $('.partners').slick(slickOptions)
  $('.funders').slick(slickOptions)}

function _parallax() {
  new Rellax('.rellax', { center: true })}

function _cookieNag() {
  $.cookie = Cookies
  let nagCookie = Cookies.get('accepts-cookies')
  // Automatically shows on init if cookie isn't set
  if(!nagCookie) $('.cookie.nag').slideDown() }

function _map() {
  if ($('#map').length === 0) return
  let map         = L.map('map', {center: [48.19,16.355],
                                  zoom:   13,
                                  minZoom: 13,
                                  maxZoom: 13,
                                  zoomControl: false,
                                  closePopupOnClick: false,
                                  boxZoom: false,
                                  doubleClickZoom: false,
                                  dragging: true}),
      url         = 'https://api.mapbox.com/styles/v1/lowi/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
      tileOptions = { id: 'cizs9vc8c007u2st6upirwcw1',
                      accessToken: 'pk.eyJ1IjoibG93aSIsImEiOiJjaXpyZnYwMHUwMDI2MnFzN21wNm1zeGF2In0.t4FHMAzcW-5SMIfKneu3YQ' },
      popupContent = '<a href="https://www.openstreetmap.org/#map=16/48.1882/16.3782&layers=T" target="_blank">Mommsengasse 35<br> 1040 Wien.</a>'

  L.tileLayer(url, tileOptions).addTo(map)
  L.popup({closeButton: false})
    .setLatLng([48.1881866,16.3769259])
    .setContent(popupContent)
    .openOn(map) }

function _slack() {
  if ($('#slack-messages').length === 0) return
  Slack.init('.slack-input', '.button.slack', '#slack-messages')}

function _fixHeader() {

  $("#title")
    .visibility({ type: 'fixed', 
                  offset: 24 })

  let SECTION_HEADER_OFFSET = 72
  $(".sticky.section.header")
    .visibility(
      { type: 'fixed', 
        offset: SECTION_HEADER_OFFSET,
        onUpdate: function(calculations) {
          let containerBB   = $(this).parent()[0].getBoundingClientRect()
          if (containerBB.bottom <= SECTION_HEADER_OFFSET) 
            $(this).addClass('hidden')
          if (containerBB.bottom > SECTION_HEADER_OFFSET) 
            $(this).removeClass('hidden')}})}

$(document)
  .ready(function () {
    _menu()
    _i18n()
    _scrollSmoothly()
    team.init('.core.team.member')
    _parallax()
    _map()
    _cookieNag()
    _fixHeader()
    _projects()
    _partners()
    // loopScroll('.pusher', '.segment')
    // _slack()
    bloom('#bloom', '.bloom')

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
