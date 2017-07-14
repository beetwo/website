import OpenSimplexNoise from 'open-simplex-noise'
import {select, selectAll} from 'd3-selection'
import {scaleLinear, scalePow} from 'd3-scale'
import {forceSimulation, forceCollide, forceX, forceY} from 'd3-force'
import {easePolyOut} from 'd3-ease'

// debug flag for rendering force-circles
let RENDER_CIRCLES = false

let HEXAGON   = 'M-6.935577799999997 -59.9957423C-3.105163900000001 -62.20723276 3.0986864999999995 -62.21097249 6.935577800000004 -59.9957423L48.490048 -36.0042577C52.320462000000006 -33.7927672 55.425625999999994 -28.421945 55.425625999999994 -23.9914846L55.425625999999994 23.991484600000007C55.425625999999994 28.414465500000006 52.326938999999996 33.7890275 48.490048 36.00425799999999L6.935577800000004 59.99574200000001C3.1051638999999938 62.207233 -3.0986864999999995 62.210972 -6.935577799999997 59.99574200000001L-48.490048099999996 36.00425799999999C-52.3204619 33.7927672 -55.42562584 28.421944999999994 -55.42562584 23.991484600000007L-55.42562584 -23.9914846C-55.42562584 -28.4144655 -52.3269393 -33.7890275 -48.490048099999996 -36.0042577L-6.935577799999997 -59.9957423z'
let PALLETE   = _.shuffle(["#5ca6b2",  "#a6c85d", "#ff6b67", "#ff9e4f", "#ffdb69"])
// let PALLETE   = _.shuffle(["#00FFFE", "#a6c85d", "#5ca6b2", "#ff6b67", "#ff9e4f", "#ffdb69", "#655e7e"])
let MAX_SCALE = 16

let noise   = new OpenSimplexNoise(_.now()),
    timeΣ   = scaleLinear()
                .domain([0, 1])
                .range([0, 0.0001]),
    noiseΣ  = scaleLinear()
                .domain([-1, 1])
                .range([-0.5, 0.5]),
    targetXΣ = scaleLinear(),
    targetYΣ = scaleLinear(),
    hexΣ    = scaleLinear()
                .domain([320, 1920])
                .range([1, 1])

function color(index) { return _.nth(PALLETE, index) }
function xFocus(w) { return 0.62 * w }
function yFocus(h) { return 0.38 * h }

// function _hexWidth(){ return $('#hex').width() }
function _hexWidth(){ return $('#hex')[0].getBoundingClientRect().width }
function _windowHeight(){ return $(window).height() }

// obacht! dirty dirty hack. hard code the selectors which should be —and partially are— configurable
function _totalHeight(){
  // return $(document).height() - $('.pusher > .bloom.segment').last().outerHeight()
  let ε = $('.pusher').first()
  return ε.offset().top + ε.outerHeight() - _windowHeight()}

//              _
//  ___ __ __ _| |___ ___
// (_-</ _/ _` | / -_|_-<
// /__/\__\__,_|_\___/__/

function _domain({id, top, height}) {
  let stops = { 'startExpand': 0,
                'stopExpand':  0.62 * _windowHeight(),
                'startGrow':   0.62 * _windowHeight() + 1,
                'stopGrow':    _windowHeight(),
                'startShrink': _totalHeight() - _windowHeight(),
                'stopShrink':  _totalHeight(),
                'infinity':    1000000}
  return _.values(stops) }

function _sizeRange({id, top, height}) {

  let MIN_SCALE = 0.62
  let stops = { 'startExpand':    1,
                'stopExpand':     1,
                'startGrowing':   1,
                'stopGrowing':    1,
                'startShrinking': 1,
                'stopShrinking':  4 * MIN_SCALE,
                'infinity':       4 * MIN_SCALE }

  // first screen
  if (top === 0)
    stops = { 'startExpand':  1,
              'stopExpand':   1,
              'startGrowing': 1,
              'stopGrowing':  MAX_SCALE,
              'startShrink':  MAX_SCALE,
              'stopShrink':   4 * MIN_SCALE,
              'infinity':     4 * MIN_SCALE }

  return _.values(stops) }

function _forceRange({id, top, height}) {
  // the minimum collision circle radius is 4
  let MIN_SCALE = 4,
      // the with depends on the size of the hexagon template
      w = 0.5 * _hexWidth() / hexΣ($(window).width()),

      stops = { 'startExpand':  MIN_SCALE,
                'stopExpand':   w,
                'startGrow':    w,
                'stopGrow':     w,
                'startShrink':  w,
                'stopShrink':   24 * MIN_SCALE,
                'infinity':     24 * MIN_SCALE }

  if (top === 0)
    stops = { 'startExpand':  MIN_SCALE,
              'stopExpand':   w,
              'startGrow':    w,
              'stopGrow':     w * MAX_SCALE,
              'startShrink':  w * MAX_SCALE,
              'stopShrink':   24 * MIN_SCALE,
              'infinity':     24 * MIN_SCALE }

  return _.values(stops) }

function _resizeSegments(segments) {
  return _.map(segments, (ς) => {
            let δSize   = _domain(ς),
                ρSize   = _sizeRange(ς),
                δForce  = _domain(ς),
                ρForce  = _forceRange(ς)

            ς.sizeΣ   = scalePow()
                          .exponent(3)
                          .domain(δSize)
                          .range(ρSize)

            ς.forceΣ  = scalePow()
                          .exponent(3)
                          .domain(δForce)
                          .range(ρForce)

            return ς })}

function _resize(β) {
  // the svg spans the whole viewport
  let width       = $(window).width(),
      height      = $(window).height()

  targetXΣ.domain([0, _totalHeight()]).range([0, 0.12 * width])
  targetYΣ.domain([0, _totalHeight()]).range([0, 0.12 * height])

  β.xΦ.x(targetXΣ(0))
  β.yΦ.y(targetYΣ(0))

  β.svg.attr('width', width).attr('height', height)
  β.group.attr('transform', 'translate(' + xFocus(width) + ',' + yFocus(height) + ')')
  β.hex.attr('transform', 'scale(' + hexΣ(width) + ')')

  β.node.style('transform', () => {
    return 'translate3d(' + (targetXΣ(0) + _.random(-64, 64)) + 'px,' + (targetYΣ(0) + _.random(-64, 64))  + 'px, 0)' })

  // initialize the segment scales
  β.segments = _resizeSegments(β.segments)

  return β }

function _findSegment(id, segments) { return _.find(segments, (σ) => { return σ.id === id})}

function _noise(ι) { return noiseΣ(noise.noise2D(timeΣ(_.now()), ι)) }

// called at each animation tick
function  ticked(β) {
  // the current scroll offset
  let top = $(window).scrollTop()
  // update the node radii depending on the scroll position
  _.each(β.nodes, (η) => {
    let σ =  _findSegment(η.id, β.segments)
    η.radius = σ.forceΣ(top) })

  // as the radii change, constantly update the collissionΦ
  β.colissionΦ.radius((η, i) => { return η.radius })

  // the position forces wander a little bit
  β.xΦ.x(targetXΣ(top))
  β.yΦ.y(targetYΣ(top))

  β.node // adjust each node
  // set the simulation position
    .style('transform', (δ) => {return 'translate3d(' + _.round(δ.x) + 'px,' + _.round(δ.y) + 'px, 0)' })
    // scale according to scroll position
    .each((δ, ι, η) => {
      let σ =  _findSegment(δ.id, β.segments)
      select(η[ι]) // I have not the faintest idea why my this references ain't working nomore
        .select('use')
        .attr('transform', 'scale(' + σ.sizeΣ(top) + ')') })

  if(RENDER_CIRCLES)
    β.circle
      .style('transform', (δ) => {return 'translate3d(' + _.round(δ.x) + 'px,' + _.round(δ.y) + 'px, 0)' })
      .attr('r', (δ) => { return δ.radius })

  β.simulation.alphaTarget(0.3)
  β.simulation.restart()

  return β }

function _initializeSimulation(β) {
  return new Promise((resolve) => {
    // make simaulation & forces
    let simulation  = forceSimulation(),
        colissionΦ  = forceCollide()
                        .iterations(12)
                        .radius((δ) => { return δ.radius }),
        xΦ          = forceX(),
        yΦ          = forceY()
    simulation.nodes(β.nodes)
    simulation.force('colission', colissionΦ)
    simulation.force('x', xΦ)
    simulation.force('y', yΦ)

    // put into β
    β.colissionΦ  = colissionΦ
    β.xΦ          = xΦ
    β.yΦ          = yΦ
    β.simulation  = simulation

    resolve(β)})}

function _initializeDOM(parentId, β) {

  console.log('_initializeDOM', parentId, β)

  return new Promise((resolve) => {
    let parent      = select(parentId),
        svg         = parent.append('svg')
                        // .style('opacity', 0)
                        ,
        defs        = svg.append('defs'),
        group       = svg.append('g'),
        hex         = defs.append('path')
                        .attr('d', HEXAGON)
                        .attr('id', 'hex'),
        node        = group.append('g')
                        .attr('class', 'nodes')
                        .selectAll('.hex')
                        .data(β.nodes)
                        .enter()
                        .append('g')
                        .attr('id', (d, i) => { return 'hex-' + (d.id || i) })
                        .attr('class', 'hex')
                        .each((δ, ι, η) => {
                          select(η[ι]).append('use')
                            .attr('xlink:href', '#hex')
                            .attr('fill', δ.color) }),
        circle      = RENDER_CIRCLES ? group.append('g')
                        .attr('class', 'debug')
                        .selectAll('circle')
                        .data(β.nodes)
                        .enter()
                        .append('circle')
                        .attr('id', (d, i) => { return 'circle-' + (d.id || i) })
                        .attr('r', (δ) => { return δ.radius}): group.append('g')

    β.parent    = parent
    β.svg       = svg
    β.group     = group
    β.hex       = hex
    β.node      = node
    β.circle    = circle

    resolve(β) })}

function _initializeNodes(numSegments) {
  return new Promise((resolve) => {
    let β   = {}
    β.nodes = _(numSegments)
                .range()
                .map((ι) => {
                  return {color:  color(ι),
                          id:     `n-${ι}`,
                          radius: 2,
                          x:      _.random(-64, 64),
                          y:      _.random(-64, 64) } })
                .value()
    resolve(β)})
}


function init(parentId, numSegments) {
  if ($(parentId).length === 0) return

  _initializeNodes(numSegments)
    .then( (β) => { return _initializeDOM(parentId, β) })
    .then( (β) => { return _initializeSimulation(β) })
    .then( (β) => { return new Promise((resolve) => { _.delay(() => { resolve(_resize(β)) }, 810) } ) })
    .then( (β) => { // attach window handlers
                    $(window).on('resize', _.debounce(() => { _resize(β) }, 148))
                    // $(window).on('scroll', () => { console.log('scroll', $(window).scrollTop()) })

                    // start the simulation
                    // β.simulation.on('tick', () => {β = ticked(β)})

                    // set the menu background to the main color
                    // select('#menu-bg').style('background', color(0))

                    // β.svg.transition()
                    //   .duration(810)
                    //   .ease(easePolyOut.exponent(2))
                    //   .style('opacity', 1)
    })
}

export default init

