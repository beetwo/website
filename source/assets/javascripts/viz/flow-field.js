import {select, selectAll} from 'd3-selection'
import OpenSimplexNoise from 'open-simplex-noise'
import {scaleLinear} from 'd3-scale'
import util from '../util'

let γ       = { render: true,
                resolution: 8,
                padding: 1,
                strength: 1 },

    δΣ      = scaleLinear()
                .domain([-1, 1])
                .range([0, 2*Math.PI]),

    σΣ      = scaleLinear()
                .domain([-1, 1])
                .range([0.01, 1]),

    timeΣ   = scaleLinear()
                .domain([0, 1])
                .range([0, 0.00004]),

    indexΣ  = scaleLinear()
                .domain([0, 1])
                .range([0, 0.1])

function _force(β) {
  return function(strength) {
    var nodes, strengths

    if( !_.isFunction(strength) )
      strength = util.constant(_.isNil(strength) ? γ.strength : +strength)    
  
    function force(alpha) {
      // return if the cells have not been initialized yet
      if(_.isNil(β.flowField.cells)) return

      _.each(nodes, (n, i) => {
        // find the cell over which the node is located
        let cell = _.find(β.flowField.cells, function(c) {
          return  c.x <= n.x && c.y <= n.y &&
                  n.x < ( c.x + c.s ) && n.y < ( c.y + c.s )})

        if(!_.isNil(cell)) {
          n.vx += Math.sin(cell.δ) * cell.σ * strengths[i] * alpha
          n.vy += Math.cos(cell.δ) * cell.σ * strengths[i] * alpha }})}
  
    function initialize() {
      if (!nodes) return
      strengths = _.map(nodes, (n, i) => { return +strength(n, i, nodes) })}
  
    force.initialize = function(_) {
      nodes = _
      initialize() }
  
    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : util.constant(+_), initialize(), force) : strength }
  
    return force }}


function _cell(x, y, cellSize) {
  return {
    ιx: x,
    ιy: y,
    x:  x * cellSize,
    y:  y * cellSize,
    s:  cellSize,
    δ:  0,
    σ:  1 }}

function _render(β) {
  let g     = β.svg.append('svg:g')
                .attr('class', 'flow-field'),
      cells = g.selectAll('g')
                .data(β.flowField.cells)

  cells.enter()
    .append('svg:g')
    .style('transform', (c) => { return `translate3d(${c.x+c.s/2}px, ${c.y+c.s/2}px, 0)`})
    .attr('class', 'cell')
    .each(function() {

      // select(this).append('svg:rect')
      //   .attr('x', (c) => { return -c.s/2})
      //   .attr('y', (c) => { return -c.s/2})
      //   .attr('width', (c) => { return c.s})
      //   .attr('height', (c) => { return c.s})

      select(this).append('svg:line')
        .attr('x1', (c) => {return 0})
        .attr('y1', (c) => {return 0})
        .attr('x2', (c) => {return c.s*Math.sin(c.δ)})
        .attr('y2', (c) => {return c.s*Math.cos(c.δ)})})}

function _makeCells(cellSize, nx, ny) {
  let xRange  = _.range(-γ.padding, nx + γ.padding),
      yRange  = _.range(-γ.padding, ny + γ.padding),
      cells   = _.map(xRange, function(x) {
                  return _.map(yRange, function(y) {
                    return _cell(x, y, cellSize) }) })
  return _.flatten(cells) }

function _resize(β) {
  let width     = β.svg.node().getBoundingClientRect().width,
      height    = β.svg.node().getBoundingClientRect().height,
      cellSize  = _.min([width, height])/γ.resolution,
      nx        = _.ceil(width/cellSize),
      ny        = _.ceil(height/cellSize),
      cells     = _makeCells(cellSize, nx, ny)
  β.flowField.cells = cells 
  if(γ.render) _render(β) }

function update(β) {
  _.each(β.flowField.cells, (c) => {
    c.δ = δΣ(β.flowField.δNoise.noise3D(indexΣ(c.ιx), indexΣ(c.ιy), timeΣ(_.now())))
    c.σ = σΣ(β.flowField.σNoise.noise3D(indexΣ(c.ιx), indexΣ(c.ιy), timeΣ(_.now()))) })

  if(γ.render) {
    β.svg.selectAll('g.cell')
      .each(function(c) {
        select(this).selectAll('line')
                    .attr('x2', c.σ * c.s * Math.sin(c.δ))
                    .attr('y2', c.σ * c.s * Math.cos(c.δ))})}}


function init(β) {
  β.flowField         = {}
  β.flowField.δNoise  = new OpenSimplexNoise(Date.now() + _.random(Date.now()))
  β.flowField.σNoise  = new OpenSimplexNoise(Date.now() + _.random(Date.now()))
  β.flowField.force   = _force(β)

  // defer the resize so that everything can initialize properly
  _.defer(() => {_resize(β)})
  $(window).on('resize', _.debounce(() => { _resize(β) }, 120))
}

export default {init:   init,
                update: update}