import {select, selectAll} from 'd3-selection'
import {scaleLinear, scalePow} from 'd3-scale'
import {forceSimulation, forceCollide, forceX, forceY} from 'd3-force'
import {easeQuadInOut} from 'd3-ease'
import {timer} from 'd3-timer'
import flowField from './flow-field'
import moduloForce from './modulo-force'
import store from 'store'
import util from '../util'

let TWEEN = require('@tweenjs/tween.js')

// debug flag for rendering force-circles
let RENDER_CIRCLES = false

let HEXAGON   = 'M-6.935577799999997 -59.9957423C-3.105163900000001 -62.20723276 3.0986864999999995 -62.21097249 6.935577800000004 -59.9957423L48.490048 -36.0042577C52.320462000000006 -33.7927672 55.425625999999994 -28.421945 55.425625999999994 -23.9914846L55.425625999999994 23.991484600000007C55.425625999999994 28.414465500000006 52.326938999999996 33.7890275 48.490048 36.00425799999999L6.935577800000004 59.99574200000001C3.1051638999999938 62.207233 -3.0986864999999995 62.210972 -6.935577799999997 59.99574200000001L-48.490048099999996 36.00425799999999C-52.3204619 33.7927672 -55.42562584 28.421944999999994 -55.42562584 23.991484600000007L-55.42562584 -23.9914846C-55.42562584 -28.4144655 -52.3269393 -33.7890275 -48.490048099999996 -36.0042577L-6.935577799999997 -59.9957423z'
let PALLETE   = _.shuffle(["#5ca6b2",  "#a6c85d", "#ff6b67", "#ff9e4f", "#ffdb69"])
// let PALLETE   = _.shuffle(["#00FFFE", "#a6c85d", "#5ca6b2", "#ff6b67", "#ff9e4f", "#ffdb69", "#655e7e"])
let MAX_SCALE = 6
let POSITION_MAX_FORCE = 0.0025
let POSITION_MIN_FORCE = 0.0009
let FLOW_FIELD_MAX_FORCE = 0.6

let IDLE_TIMEOUT = 1000 * 60 * 0.5
let IDLE_AMINATION_DURATION = 1000 * 60 * 4
let IDLE_BLUR = 2

let HEX_SIZE_TO_RADIUS_RATIO = 1.05

// let FLOW_FIELD_MIN_FORCE = 0.002


let primoΣ      = scaleLinear(),
    hexΣ        = scaleLinear(),
    colissionΣ  = scaleLinear()

function color(index) { return _.nth(PALLETE, index) }
function _hexWidth(){ return $('#hex')[0].getBoundingClientRect().width }
function _windowHeight(){ return $(window).height() }

function _totalHeight(){
  let ε = $('.pusher').first()
  return ε.offset().top + ε.outerHeight() - _windowHeight()}

// called when the window is being resized. also called upon init
function _resize(β) {
  // the svg spans the whole viewport
  let width     = $(window).width(),
      height    = $(window).height(),
      bb        = { x: 0,
                    y: 0,
                    w: width,
                    h: height},
      hexRadius   = $('.hex')[1].getBoundingClientRect().width/2

  β.bb = bb
  β.hexRadius = hexRadius

  // update the scales
  // primo scale is the scale for the first of the hexagons
  // it behaves differently from the rest
  primoΣ
    .domain([0, height, height + (_totalHeight() - height)/2, _totalHeight()])
    .range([1, 1, MAX_SCALE, 1])

  // hex is the scale for all other hexagons
  // which just returns 1 for all inputs
  hexΣ
    .domain([0, height, height + (_totalHeight() - height)/2, _totalHeight()])
    .range([1, 1, 2, 1])

  // radius is the scale for the colission radii
  // used when scroll.top < window.height
  colissionΣ
    .domain([0, height, _totalHeight()])
    .range([2, hexRadius, hexRadius])

  // update the forces
  β.xΦ.x(width/2)
  β.yΦ.y(height/2)
  β.moduloΦ.boundingBox(bb)

  β.svg.attr('width', width).attr('height', height)
  // β.hex.attr('transform', 'scale(' + hexΣ(width) + ')')
  return β }

// called at each animation tick
function  ticked(β) {

  // check that we're not idling
  if(!β.idle) {
    // the current scroll offset
    let top = $(window).scrollTop()

    // update the node radii depending on the scroll position
    _.each(β.nodes, function(η, i) {
      // if the scroll top is smaller that the window height
      // lineary scale the size from 2 to the unscaled hex radius
      if(top <= β.bb.h) {
        η.radius = colissionΣ(top)
        return }
  
      // let primoRadius = $('.hex')[0].getBoundingClientRect().width/2
      // η.radius = primoRadius
      if( i===0 ) {
        let primoRadius = $('.hex')[0].getBoundingClientRect().width/2
        η.radius = primoRadius * HEX_SIZE_TO_RADIUS_RATIO
      } else {
        let radius = $('.hex')[1].getBoundingClientRect().width/2
        η.radius = radius* HEX_SIZE_TO_RADIUS_RATIO }})
    
    β.node
      .each(function(δ, ι, η) {
        select(this)
          .attr('data-scale', (ι === 0) ? primoΣ(top) : hexΣ(top)) 
          .select('use')
          // .attr('transform', 'scale(' + primoΣ(top) + ')') 
          .attr('transform', 'scale(' + ((ι === 0) ? primoΣ(top) : hexΣ(top)) + ')')})
  }

  // as the radii change, constantly update the collissionΦ
  β.colissionΦ.radius((η, i) => { return η.radius })
  
  // update the node positions
  β.node.style('transform', function(δ) { return `translate3d( ${δ.x}px, ${δ.y}px, 0)` })

  if(RENDER_CIRCLES)
    β.circle
      .style('transform', (δ) => {return 'translate3d(' + _.round(δ.x) + 'px,' + _.round(δ.y) + 'px, 0)' })
      .attr('r', (δ) => { return δ.radius })

  flowField.update(β)
  β.simulation.alphaTarget(1)
  β.simulation.restart()

  return β }

function _initializeSimulation(β) {
  return new Promise((resolve) => {
    // make simaulation & forces
    let simulation  = forceSimulation(),
        colissionΦ  = forceCollide()
                        .iterations(12)
                        .radius((δ) => { return δ.radius }),
        xΦ          = forceX().strength(POSITION_MAX_FORCE),
        yΦ          = forceY().strength(POSITION_MAX_FORCE),
        flowΦ       = β.flowField.force(FLOW_FIELD_MAX_FORCE),
        moduloΦ     = moduloForce()

    // moduloΦ.padding(0.072)

    simulation.nodes(β.nodes)
    simulation.force('colission', colissionΦ)
    simulation.force('x', xΦ)
    simulation.force('y', yΦ)
    simulation.force('flow', flowΦ)
    // simulation.force('modulo', moduloΦ)

    // put into β
    β.colissionΦ  = colissionΦ
    β.xΦ          = xΦ
    β.yΦ          = yΦ
    β.flowΦ       = flowΦ
    β.moduloΦ     = moduloΦ
    β.simulation  = simulation

    resolve(β)})}

function _initializeFlowField(β) {
  return new Promise((resolve) => {
    flowField.init(β)
    resolve(β)})}

function _initializeFlowField(β) {
  console.log('initializing flow field')
   let  δNoiseSeed  = Date.now() + _.random(Date.now()),
        σNoiseSeed  = Date.now() + _.random(Date.now())
  return new Promise((resolve) => {
    flowField.init(β, δNoiseSeed, σNoiseSeed)
    resolve(β)})}

function _recreateFlowField(β, noise) {
  console.log('recreating flow field')
   let  δNoiseSeed  = noise.δNoiseSeed,
        σNoiseSeed  = noise.σNoiseSeed
  return new Promise((resolve) => {
    flowField.init(β, δNoiseSeed, σNoiseSeed)
    resolve(β)})}

function _initializeDOM(parentId, β) {
  return new Promise((resolve) => {
    let parent      = select(parentId),
        svg         = parent.append('svg'),
        defs        = svg.append('defs'),
        // blur        = defs.append('filter')
        //                 .attr('id', 'gaussian-blur')
        //                 .attr('x', '-50%')
        //                 .attr('y', '-50%')
        //                 .attr('width', '200%')
        //                 .attr('height', '200%')
        //                 .append('feGaussianBlur')
        //                 .attr('in', 'SourceGraphic')
        //                 .attr('stdDeviation', 0),
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
                        // .attr('filter', 'url(#gaussian-blur)')
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
    // β.blur      = blur
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
                          radius: 42,
                          x:      _.random(0, 768),
                          y:      _.random(0, 1024) } })
                .value()
    resolve(β)})}

function _recreateNodes(nodes) {
  return new Promise((resolve) => {resolve({nodes: nodes})})}

function _idleTimer(β) {

  let positionForce = { ƒ: POSITION_MAX_FORCE },
      positionTween = new TWEEN.Tween(positionForce)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .to({ƒ: POSITION_MIN_FORCE}, IDLE_AMINATION_DURATION)
                        .onUpdate(function() {
                          β.xΦ.strength(positionForce.ƒ)
                          β.yΦ.strength(positionForce.ƒ)}),
      radiiTweens

  function _idleTimeout() {
    radiiTweens = _.map(β.nodes, function(η) {
                    let radius  = { ρ: η.radius },
                        τ       = new TWEEN.Tween(radius)
                                    .easing(TWEEN.Easing.Quadratic.InOut)
                                    .to({ρ: β.hexRadius * (MAX_SCALE/2) * _.random(0.62, HEX_SIZE_TO_RADIUS_RATIO, true) }, IDLE_AMINATION_DURATION)
                                    .onUpdate(function() {
                                      η.radius = radius.ρ})
                    τ.start()
                    return τ })

    β.node
      .each(function() {
        select(this)
          .select('use')
          .transition()
          .ease(easeQuadInOut)
          .duration(IDLE_AMINATION_DURATION)
          .attr('transform', `scale(${MAX_SCALE * _.random(0.38, 1, true)})`) })

    β.idleTimer.stop()
    β.idle = true
    // β.blur
    //   .transition()
    //   .ease(easeQuadInOut)
    //   .duration(IDLE_AMINATION_DURATION)
    //   .attr('stdDeviation', IDLE_BLUR)

    positionTween.start()}

  function _resetTimeout() {
    positionTween.stop()

    β.idleTimer.restart(_idleTimeout, IDLE_TIMEOUT) 
    β.idle = false
    // β.blur.interrupt()
    // β.blur
    //   .transition()
    //   .duration(400)
    //   .attr('stdDeviation', 0)
    β.xΦ.strength(POSITION_MAX_FORCE)
    β.yΦ.strength(POSITION_MAX_FORCE)

    _.each(radiiTweens, function(τ) { τ.stop() })

    // reset the node radius rtransition
    β.node
      .each(function() {
        select(this).select('use').interrupt()})
  }
  
  function _animateTween( time ) {
    requestAnimationFrame( _animateTween )
    TWEEN.update( time )}
 
  // start the idle timer
  // when no interaction (clicks, scroll…) takes place for a while
  // the hexagons start to change. Upon the next event everythin snaps
  // back to normal
  β.idleTimer = timer(_idleTimeout, IDLE_TIMEOUT)

  // listen for events that reset the idle timer
  $(window).on('click', _resetTimeout)
  $(window).on('scroll', _resetTimeout) 

  // initialize the tween animation
  _animateTween()
}

// intercept hyperlinks and write the current state of the bloom
// to local storage
// this is used to provide continuity of the bloom animation
// across different html sites.
// when a link is clicked and the site is about to navigate to a new site
// we wirite the data. Upon loading the new page we check
// local storage. If bloom data exists and is not out of date
// the bloom is initialized with the given settings
function _interceptHyperlinks(β) {
  $('a').click(function(){
    let nodes = β.nodes,
        flowField = _.pick(β.flowField, ['δNoiseSeed', 'σNoiseSeed'])
    store.set('bloom', 
      { nodes:      nodes,
        flowField:  flowField,
        τ:          _.now() })})}


// initialize the bloomy thingiez in the background
function init(parentId, numSegments) {

  // abort if the div with the given id isn't there
  if ($(parentId).length === 0) return

  let storageBloom = store.get('bloom') || {}
  // invalidate if the chache is old
  if(storageBloom.τ + (12 * 1000) < _.now()) storageBloom = {}
  let nodeΦ = storageBloom.nodes ? _recreateNodes(storageBloom.nodes) : _initializeNodes(numSegments)

  nodeΦ
    .then( (β) => { return _initializeDOM(parentId, β) })
    .then( (β) => { return storageBloom.flowField ? _recreateFlowField(β, storageBloom.flowField) : _initializeFlowField(β) })
    .then( (β) => { return _initializeSimulation(β) })
    .then( (β) => { return _resize(β) })
    .then( (β) => { // attach window handlers
                    $(window).on('resize', _.debounce(() => { _resize(β) }, 148))
                    // $(window).on('scroll', () => { console.log('scroll', $(window).scrollTop()) })

                    // start the simulation
                    β.simulation.on('tick', () => { β = ticked(β) })

                    _interceptHyperlinks(β)
                    _idleTimer(β)})}

export default init

