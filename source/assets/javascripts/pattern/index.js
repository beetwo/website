(function pattern() {
  var d3          = require('d3'),
      vector      = require('../vector'),
      util        = require('./util'),
      dom         = require('./dom'),
      grad        = require('./gradient'),
      hex         = require('./hexagons/index'),
      sim         = require('./simulation'),
      config      = require('../config')

  function _mouse(self) {
    return vector.fromArray(d3.mouse(self)) }

  function _reInitialize(parentId, contentId) {
    return function() {
      var 
          // dimensions
          // ————————————————
          width           = math.round($(parentId).width()),  // the width of the svg canvas
          height          = math.round($(parentId).height()), // the height of the svg canvas
          dimensions      = {x: width, y: height},

          // DOM
          // ————————————————
          dom             = require('./dom').init(parentId),

          // grid
          // ————————————————
          grid            = require('./grid').make(dimensions),

          // content
          // #obacht: must be initialzied before the simulation AND the pattern
          // ————————————————
          content         = require('./content').initialize(contentId, grid, dom),

          // simulation
          // ————————————————
          simulation      = sim.initialize(grid, dimensions),

          // gradient
          // ————————————————
          gradient        = grad.initialize(dimensions, dom),          

          // pattern
          // ————————————————
          hexagons        = hex.initialize(dimensions, simulation.nodes(), dom)

      // …render the simulation (for debug)
      // simulation.render(dom.simulation)

      // …event handlers
      dom.vis.on('mousemove', function() { 
        // update the simulation
        simulation.mouseHandler(_mouse(this), dom.vis.node())
        d3.event.stopPropagation() })

      dom.vis.on('click', function() {
          var m = _mouse(this),
              n = sim.find(m) 
          if(n.content && n.content.href)
            window.location.href = n.content.href })

      simulation.on('tick', function(i) { 
        simulation.update()
        hexagons.update(simulation.nodes()) })
  }} 

  function init(parentId, contentId) {
    _reInitialize(parentId, contentId)()
    // Debounce to avoid costly calculations while the window size is in flux.
    $(window).on('resize', _.debounce(_reInitialize(parentId, contentId), 150))}

  module.exports = { init: init }
})()
