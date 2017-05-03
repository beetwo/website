(function patternSimulation() {

  var inter     = require('kld-intersections').Intersection,
      Point2D   = require('kld-affine').Point2D,
      vector    = require('../geom/vector'),
      config    = require('../config'),
      positionΦ = require('./force/position'),
      focusΦ    = require('./force/focus')

  var nodes, 
      mouseNode,
      focusNode,
      mouseForce, 
      positionForce, 
      focusForce,
      
      domIndexLine,
      dom,
      domNodes, simulation,
      previousMouse,
      intersections,
      domIntersections,
      frameDimensions,

      repelForces,
      repelNodes,
      repelStrengths,
      attractNodes,

      mouseStrength = 0,
      ε             = 2,
      // flag indicating that a content node is currently in focus
      focusing      = false,
      DEFAULT_FOCUS_STRENGTH = 92,
      MAX_FOCUS_STRENGTH     = 128,
      focusΔ        = DEFAULT_FOCUS_STRENGTH,

      indexΦΣ       = d3.scalePow()
                        // .exponent(0.25)
                        .domain([  0,     32, 128, 1024])
                        .range([-0.16 , -0.08,   0, 0]),
      εIndex        = -0.01

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
      if(mouseStrength === 0) return
      if(mouseStrength < ε) mouseStrength = 0
      else mouseStrength *= 0.98
      mouseForce.strength(mouseStrength) }

   function _decayRepelStrengths() {
    repelStrengths = _.map(repelStrengths, function(strength, index) {
      if(strength === 0) return 0
      if(strength > εIndex) strength = 0
      else strength *= 0.94
      repelForces[index].strength(strength)
      return strength
    })
       }

  function _makeMouseForce(mouseNode) {
      var force       = focusΦ()
      force.focusNode(mouseNode)
      force.strength(0)
      return force }

  function _makeRepelForces(repelNodes, mouseNode, config) {
      var forces  = _.map(repelNodes, function(n) {
                      var link  = { source: n, target: mouseNode }
                      return  d3.forceLink([link]).strength(0) })
      return forces }

  function _makeFocusForce(nodes, {strength}){
      var force = focusΦ(nodes)
      force.strength(strength)
      return force }

  function _render(_dom) {
    dom       = _dom
    domNodes  = dom
                  .selectAll('circle.node')
                  .data(this.nodes())
                    .enter()
                      .append('circle')
                        .attr('class', function(n){
                          if(n.vicinity === 'mouse') return 'mouse node'
                          else return 'site node'})
                        .attr('cx', function(n) { return n.x })
                        .attr('cy', function(n) { return n.y }) 
    
    // handle intersection rendering
    domIntersections  = dom.selectAll('circle.intersection')
    domIndexLine      = dom.append('path').attr('class', 'line')
  }

  function _point(p) {
    if(!_.isArray(p)) p = vector.toArray(p)
    return new Point2D(p[0], p[1]) }

  function _intersect(point0, point1, polygon) {
    if(!polygon) return
    var center  = _point(polygon.data),
        p0      = _point(point0),
        p1      = _point(point1),
        ϛ       = _.map(polygon, function(p) {
                    return _point(p).add(center)})
    return inter.intersectLinePolygon(p0, p1, ϛ) }

  function _updateRepelForces() {
    repelNodes = _.map(repelNodes, function(node, index) {
      if(_.isNil(node.polygon)) return node

      intersections = _intersect(node, mouseNode, node.polygon)
      var ιp        = _.first(intersections.points),
          δ         = _.isNil(ιp) ? 0 : vector.δ(ιp, mouseNode),
          ς         = indexΦΣ(δ),
          strength  = repelStrengths[index]
  
      // '<' because the force is always < 0 (repels, rather than attracts)
      if(ς < strength) {
        repelStrengths[index] = ς
        repelForces[index].strength(ς) }
  
      node.x  = _.clamp(node.x, 
                  -1.4 * node.dimensions.x, 
                   1.4 * node.dimensions.x + frameDimensions.x)
      
      node.y  = _.clamp(node.y, 
                  -1.4 * node.dimensions.y, 
                   1.4 * node.dimensions.y + frameDimensions.y)
      return node })

    _decayRepelStrengths() }

  function _updateFocusForce() {
     // if(focusing) {
      // focusΔ *= 1.02
      // if(focusΔ < MAX_FOCUS_STRENGTH) 
        // focusForce.strength(focusΔ)
      // else focusΔ = MAX_FOCUS_STRENGTH } 
  }

  function _renderIntersections(){
    if(_.isNil(intersections))    return
    if(_.isNil(domIntersections)) return

    domIntersections.data(intersections.points)
                      .exit().remove()
                      .enter()
                        .append('circle')
                          .attr('class', 'intersection')
                          .attr('cx', function(i) { return i.x })
                          .attr('cy', function(i) { return i.y })

    var d = [vector.toArray(mouseNode), vector.toArray(indexNode)],
        l = d3.line().curve(d3.curveLinear)
    domIndexLine.attr('d', l(d))
  }

  // called when the animation ticks
  function _update() {
    if(!_.isNil(domNodes))
      domNodes
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y }) 
    
    _decayMouseStrength()
    _renderIntersections()
    // _updateFocusForce() 
    _updateRepelForces() 
  }

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

    if(_.isNil(node.content) || _.isEqual(node.content.id, 'index')) {
      focusing     = false
      focusForce.nodeAndStrength(null, 0) 
      
    } else {
      node.inFocus = true
      focusing     = true
      focusForce.nodeAndStrength(node, MAX_FOCUS_STRENGTH) 
    }}

  // called when a mouse event occurs
  function _mouseHandler(mouse, domSVG) {
    if(_.isNil(previousMouse)) 
      previousMouse = _.clone(mouse)

    var δ = _.clamp(vector.δ(mouse, previousMouse), 500)
    if(δ > mouseStrength) {
      mouseStrength = δ
      mouseForce.strength(mouseStrength) }

    mouseNode.fx = mouse.x
    mouseNode.fy = mouse.y 
    // this.alphaTarget(0.3).restart()
    this.alphaTarget(0.6).restart()
    // this.alphaTarget(1).restart()
    previousMouse = _.clone(mouse)
    _focus(mouse, domSVG) }

  function find(position) {
    var closestNode = _(nodes)
                        .map(function(n) { return [vector.δSq(n, position), n] })
                        .sortBy(function([δ, n]) { return δ })
                        .tail() // remove the mouse node, which is —by definition— the closest node
                        .first()[1]
    return closestNode }

  function initialize(_nodes, dimensions) {

    frameDimensions = dimensions
   
    // nodes
    // ————————————————
    nodes     = _nodes
    mouseNode = _constructMouseNode(_.size(nodes))
    nodes.push(mouseNode) 

    repelNodes      = _.filter(nodes, function(n){ 
                        return n.content && n.content.force === 'repel' })
    attractNodes    = _.filter(nodes, function(n){ 
                        return n.content && n.content.force !== 'repel' })
    repelStrengths  = _.map(repelNodes, function() {return 0})

    // forces
    // ————————————————
    positionForce = _makePositionForce(config.positionForce())
    mouseForce    = _makeMouseForce(mouseNode, config.mouseForce())
    focusForce    = _makeFocusForce(attractNodes, config.focusForce())
    repelForces   = _makeRepelForces(repelNodes, mouseNode, config.repelForce())

    simulation = d3.forceSimulation()
    simulation.nodes(nodes)

    simulation
      .force('position', positionForce)
      .force('mouse', mouseForce)
      .force('focus', focusForce)

    _.each(repelForces, function(f, i) {
      simulation.force('repel-' + i, f) })

    // attach render & event handler functions
    simulation.update       = _update
    simulation.render       = _render
    simulation.mouseHandler = _mouseHandler,
  

    simulation.alphaTarget(1).restart()
    // d3.timeout(simulation.stop, 1)

    return simulation }

  module.exports = {
    initialize: initialize,
    find:       find
  }

})()
