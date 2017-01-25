(function patternSimulation() {


  var vector    = require('../vector'),
      config    = require('../config'),
      positionΦ = require('./force/position'),
      focusΦ    = require('./force/focus')

  var nodes, 
      mouseNode,
      focusNode,
      mouseForce, 
      positionForce, 
      focusForce,
      domNodes, simulation,
      previousMouse,

      mouseStrength = 0,
      delta         = 0,
      ε             = 2,

      // flag indicating that a content node is currently in focus
      focusing      = false,
      DEFAULT_FOCUS_STRENGTH = 92,
      MAX_FOCUS_STRENGTH     = 500,
      focusΔ        = DEFAULT_FOCUS_STRENGTH

  var debugStrength = 0
  
  function _constructMouseNode(index) {
    return  { index:    index,
              x:        0,
              y:        0,
              vicinity: 'mouse',
              baseX:    0,
              baseY:    0}}

  function _makePositionForce({strength}) {
      var target  = { x: function(node, i, nodes) { return node.baseX },
                      y: function(node, i, nodes) { return node.baseY }},
          force   = positionΦ(target)
      if(strength) force.strength(strength)
      return force }

  function _decayMouseStrength() {
      if(delta === 0) return
      if(delta < ε)   delta = 0
      else            delta = delta * 0.98
      mouseForce.strength(delta)
  }

  function _makeMouseForce(mouseNode) {
      var force       = focusΦ()
      force.focusNode(mouseNode)
      force.strength(0)
      return force }

  function _makeFocusForce(focusNode, {strength}){
      var force       = focusΦ()
      force.focusNode(focusNode)
      force.strength(strength)
      return force }

  function _render(_dom) {
    domNodes = _dom
                .selectAll('circle')
                .data(this.nodes())
                  .enter()
                    .append('circle')
                      .attr('class', function(n){
                        if(n.vicinity === 'mouse') return 'mouse node'
                        else return 'site node'})
                      .attr('cx', function(n) { return n.x })
                      .attr('cy', function(n) { return n.y }) }

  // called when the animation ticks
  function _update() {
    if(!_.isNil(domNodes))
      domNodes
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y }) 
    _decayMouseStrength()
    if(focusing) {
      focusΔ *= 1.02
      if(focusΔ < MAX_FOCUS_STRENGTH) 
        focusForce.strength(focusΔ)
      else focusΔ = MAX_FOCUS_STRENGTH } }

  function _focus(position, domSVG) {
    var node = find(position)

    // hackedy hack to get the mouse cursor to change into a pointer
    // setting css :hover neither works neither on .cell, nor on svg:path nor on svg:use elements
    if(node.content) 
      $(domSVG).addClass('focused')
    else 
      $(domSVG).removeClass('focused')

    if(node.inFocus) return

    _(nodes).each(function(n) {n.inFocus = undefined })      

    if(_.isNil(node.content)) {
      focusing     = false
      focusForce.focusNode(null)
      focusΔ       = DEFAULT_FOCUS_STRENGTH
      
    } else {
      node.inFocus = true
      focusing     = true
      focusForce.focusNode(node) }}

  // called when a mouse event occurs
  function _mouseHandler(mouse, domSVG) {
    if(_.isNil(previousMouse)) 
      previousMouse = _.clone(mouse)

    var δ = _.clamp(vector.δ(mouse, previousMouse), 500)
    if(δ > delta) {
    // if(false) {
      delta = δ
      mouseForce.strength(delta) }

    mouseNode.fx = mouse.x
    mouseNode.fy = mouse.y 
    // this.alphaTarget(0.3).restart()
    this.alphaTarget(0.6).restart()
    // this.alphaTarget(1).restart()

    previousMouse = _.clone(mouse)

    _focus(mouse, domSVG)
  }

  

  function find(position) {
    var closestNode = _(nodes)
                        .map(function(n) { return [vector.δSq(n, position), n] })
                        .sortBy(function([δ, n]) { return δ })
                        .tail() // remove the mouse node, which is —by definition— the closest node
                        .first()[1]
    return closestNode }

  function initialize(_nodes, dimensions) {
   
    // nodes
    // ————————————————
    nodes = _nodes
    mouseNode   = _constructMouseNode(_.size(nodes))
    nodes.push(mouseNode) 

    // forces
    // ————————————————
    positionForce = _makePositionForce(config.positionForce())
    mouseForce    = _makeMouseForce(mouseNode, config.mouseForce())
    focusForce    = _makeFocusForce(null, config.focusForce())

    simulation = d3.forceSimulation()
      .force('position', positionForce)
      .force('mouse', mouseForce)
      .force('focus', focusForce)
      // .force('center', d3.forceCenter(dimensions.x/2, dimensions.y/2))

    simulation.nodes(nodes)

    // attach render & event handler functions
    simulation.update       = _update
    simulation.render       = _render
    simulation.mouseHandler = _mouseHandler

    // simulation.alphaTarget(1).restart()
    // d3.timeout(simulation.stop, 1)

    return simulation }
  

  module.exports = {
    initialize: initialize,
    find:       find
  }

})()