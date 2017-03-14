(function positionForceDefinition() {

  var vector    = require('../../vector'),
      config    = require('../../config')

  var x, y,
      strength = constant(0.1),
      nodes,
      xStrengths, yStrengths,
      xz, yz;

  function constant(c) {
    return function() {
      return c }}

  function force(alpha) {
    _.each(nodes, function(node, i) {
      node.vx += (xz[i] - node.x) * xStrengths[i] * alpha 
      node.vy += (yz[i] - node.y) * yStrengths[i] * alpha 
    })
  }
  
  function _initialize() {
    if (!nodes) return
    xz          = _.map(nodes, function(node, i) {return +x(node, i, nodes) })
    yz          = _.map(nodes, function(node, i) {return +y(node, i, nodes) })
    xStrengths  = _.map(nodes, function(node, i) {
                    if(_.isNaN(xz[i])) return 0
                    else return +strength(node, i, nodes) })
    yStrengths  = _.map(nodes, function(node, i) {
                    if(_.isNaN(yz[i])) return 0
                    else return +strength(node, i, nodes) })}

  module.exports = function(pos) {

    // functionify parameters
    // ————————————————
    var _x = pos.x, 
        _y = pos.y
    if (_.isFunction(_x)) x = _x
    else
      x = constant(_.isNil(_x) ? 0 : +_x)

    if (_.isFunction(_y)) 
      y = _y
    else
      y = constant(_.isNil(_y) ? 0 : +_y)

    // getters and setters
    // ————————————————
    force.initialize  = function(_nodes) {
                          nodes = _nodes
                          _initialize() }

    force.strength    = function (_) {
                          if(arguments.length === 0) return strength 
                          else 
                            return (strength = typeof _ === "function" ? _ : constant(+_), _initialize(), force) }
    force.x           = function _x(_) {
                          if(arguments.length === 0) return x 
                          else 
                            return (x = typeof _ === "function" ? _ : constant(+_), _initialize(), force) }
    force.x           = function _x(_) {
                          if(arguments.length === 0) return x 
                          else 
                            return (x = typeof _ === "function" ? _ : constant(+_), _initialize(), force) }

    return force}})()







