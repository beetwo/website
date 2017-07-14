import {select, selectAll} from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {interpolateCubehelix, interpolateRgb} from 'd3-interpolate'
import {hsl} from 'd3-color'
import SVGMorpheus from './svg-morpheus'

let colors      = { red:   '#BC0B24',
                    blue:  '#00A8DE',
                    green: '#71B541'},
    colorRange  = [ colors['blue'],
                    colors['red'],
                    colors['green'],
                    colors['blue'] ],
    colorΣ      = scaleLinear()
                    .domain([0, 1, 2, 3, 4])
                    .range(colorRange)

function _width(d3ε) {return $(d3ε.node()).width()}
function _height(d3ε) {return $(d3ε.node()).height()}

function _scroll() {
  let windowOffset  = $(window).scrollTop(),
      sections      = selectAll('.pusher >  div'),
      offsets       = _(sections.nodes())
                        .map((s) => {return { id: $(s).attr('id'),
                                              top: $(s).offset().top,
                                              height: $(s).height()}})
                        .value(),
      delta         = 32,
      section       = _.find(_.reverse(offsets), (o) => { 
                        return (o.top-delta) <= windowOffset && windowOffset < (o.top + o.height-delta)})
      if(section) {
        $('.non-mobile.menu > .container > div').removeClass()
        $('.non-mobile.menu > .container > div').addClass(section.id)  
        $('.non-mobile.menu .item').removeClass('active')  
        $(`.non-mobile.menu .item.${section.id}`).addClass('active')  
      }
    }


function _toc() {
  let tocOptions = {iconId:   'burger',
                    duration: 400,
                    rotation: 'none' }
  return new SVGMorpheus('#toc > #iconset', tocOptions)}


function init() {
   // no menu
  if ($('#sidebar').length === 0) return
  if ($('#toc').length === 0) return


  let tocButton = _toc()
  $('#sidebar')
    .sidebar({
      onVisible: () => {
        tocButton.to('close')
        $('#toc').addClass('open') },
      onHide: () => {
        tocButton.to('burger')
        $('#toc').removeClass('open') }})
    .sidebar('attach events', '#toc')
    .sidebar('attach events', '#sidebar > a')

  // attach click handlers
  $('.menu a.physio')
    .on('click', () => {$('#therapy-accordion').accordion('open', 0)})
  $('.menu a.ergo')
    .on('click', () => {$('#therapy-accordion').accordion('open', $('#physio .symptom').length + 1)})
  $('.menu a.ergo')
    .on('click', () => {$('#therapy-accordion').accordion('open', $('#physio .symptom').length + 1)})

  // adjust the size of the menu-logo
  let menuHeight    = 20,
      menuLogo      = select('#menu-logo > svg'),
      vb            = _.map(menuLogo.attr('viewBox').split(' '),
                        (s) => { return parseFloat(s)}),
      [x, y, w, h]  = vb,
      ratio         = menuHeight/h,
      ηw            = w * ratio
  menuLogo.attr('width', ηw)
    .attr('height', menuHeight)

  _.defer(() => {
      _scroll()
      $(window).on('scroll', () => { _scroll() })})
}

export default { init: init}
