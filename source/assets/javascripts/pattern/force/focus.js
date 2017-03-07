(function focusForceDefinition() {

  var vector    = require('../../vector'),
      config    = require('../../config')

  function jiggle() {
    return (math.random() - 0.5) * 1e-6 }

  function constant(c) {
    return function() {
      return c }}

  function index(d) {
    return d.index }

  function _empty() {}

  function _strengthFn(ξ, focusNode) {
    return function(node) {
      var σ   = (-42 * ξ ) / vector.δSq(focusNode, node),
          cσ  = _.clamp(σ, -0.5, 0)
      return cσ } }

  module.exports = function() {
    var φ = { iterations: 1,
              strengthValue: 0.0001 },
        f = force

    function force(alpha) {
      if(_.isNil(φ.nodes)) return
      if(_.isNil(φ.strength)) return
      if(_.isNil(φ.focusNode)) return

      _(φ.iterations)
        .range()
        .each(function() {
          _(φ.nodes)
            // filter out the focus node and the mouse node
            .filter(function(node) { return !_.isEqual(node, φ.focusNode) || !_.isEqual(node.vicinity, 'mouse')})
            // move each of the nodes
            .each(function(node, i) {
              var x       = (node.x + node.vx) - (φ.focusNode.x + φ.focusNode.vx) || jiggle(),
                  y       = (node.y + node.vy) - (φ.focusNode.y + φ.focusNode.vy) || jiggle(),
                  l       = math.sqrt(x * x + y * y),
                  b       = 0.5,
                  d       = 12,
                  s       = φ.strength(node)
              l       = (l - d) / l * alpha * s
              x       *= l 
              y       *= l
              node.vx -= x * b
              node.vy -= y * b }) }) }

    // getters and setters
    // ————————————————
    function _initialize(nodes) { 
      φ.nodes = nodes
      return f }


    function _strength(_strength) {
      if( arguments.length === 0) return φ.strength 
      if( _.isNil(φ.focusNode)) return
      if(!_.isNumber(_strength)) throw 'The strength must be a Number. Is: ' + (typeof _strength) 
      φ.strengthValue = _strength
      φ.strength      = _strengthFn(_strength, φ.focusNode)
      return f }
  
    function _iterations(_iterations) {
      if(arguments.length === 0) return φ.iterations
      φ.iterations = _iterations
      return f }
  
    function _focusNode(_focusNode) {
      if(_.isNil(_focusNode)) return φ.focusNode
      φ.focusNode = _focusNode
      φ.strength  = _strengthFn(φ.strengthValue, _focusNode)
      return f }

    function _nodeAndStrength(_focusNode, _strength) {
      φ.focusNode     = _focusNode
      φ.strengthValue = _strength
      φ.strength      = _strengthFn(_strength, _focusNode) }

    f.initialize      = _initialize
    f.strength        = _strength
    f.iterations      = _iterations
    f.focusNode       = _focusNode
    f.nodeAndStrength = _nodeAndStrength
    return f }})()







