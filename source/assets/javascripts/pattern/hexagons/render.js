(function hexagonRenderer() {

  var 
    d3      = require('d3'),
    vector  = require('victor'),
    util    = require('../util'),
    config  = require('../../config')

  function _initDefs(nodes, defs) {
    return defs
            .selectAll('path')
            .data(nodes)
            .enter()
              .append('path')
                .attr('id', function(n) {return 'poly-' + n.index})
                .attr('index', function(n) {return n.index})
               
  }

  function _initUse(nodes, dom) {
    var g = dom
              .selectAll('g.cell')
              .data(nodes)
              .enter()
                .append('svg:g')
                .attr('pointer-events', 'none')
                .attr('class', function(n){
                  if(n.content) return n.vicinity + ' content cell'
                  return n.vicinity + ' cell' })
                // .attr('fill', 'url(#bg-gradient)')
                .attr('content', function(n){
                  if(_.isNil(n.content)) return
                  else return n.content.id })
               
    g.append('svg:use')
      .attr('xlink:href', function(n) {return '#poly-' + n.index})
      .attr('filter', function(n){
              if(_.isNil(n.content)) return
              else return 'url(#cell-shadow)' })


               
    return  g}

  function _initClip(nodes, dom) {
    var contentNodes  = _.filter(nodes, function(n){return !_.isNil(n.content)}),
        clipPaths       = dom
                            .selectAll('clipPath.poly')
                            .data(contentNodes)
                            .enter()
                              .append('svg:clipPath')
                                .attr('class', 'poly')
                                .attr('id', function(n){ return 'clip-' + n.index })
    
    // clipPaths.append('svg:use')
    //   .attr('xlink:href', function(n) {return '#poly-' + n.index})

    clipPaths
     .append('path')
        .attr('id', function(n) {return 'clip-' + n.index})

    return  clipPaths }


  function initialize(nodes, dom) {
    var def   = _initDefs(nodes, dom.defs.defPoly),
        use   = _initUse(nodes, dom.polygon),
        clip  = _initClip(nodes, dom.defs.clipPoly)
    return {def: def, use: use, clip: clip} }

  module.exports = { initialize: initialize } })()