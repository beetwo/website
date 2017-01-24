(function patternDOM() {

  var 
    d3        = require('d3'),
    util      = require('./util')

  function _debugScale(all, w, h) {
    var scale = 0.92,
        δx    = 0.5 * w * (1 - scale),
        δy    = 0.5 * h * (1 - scale)
    all.attr('transform', 'translate(' + δx + ',' + δy + ') scale( ' + scale + ' )')
    // all.append('svg:rect')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', w)
    //   .attr('height', h)
    //   .attr('class', 'debug')
  }
  
  function initDOM(parentId) {
    $(parentId).empty(); // remove everything below the parents
    var vis         = d3.select(parentId).append('svg:svg'),
        defs        = vis.append('svg:defs'),
        all         = vis.append('svg:g').attr('id', 'everything'),
        defPoly     = defs.append('svg:g').attr('id', 'poly'),
        polygon     = all.append('svg:g').attr('class', 'polygons'),
        simulation  = all.append('svg:g').attr('class', 'simulation'),
        clipPoly    = defs.append('svg:g').attr('id', 'clip-poly'),
        content     = all.append('svg:g').attr('class', 'content'),
        gradient    = defs.append('svg:g')

    _debugScale(all, $(parentId).width(), $(parentId).height())


    return  { vis       : vis,
              polygon   : polygon,
              content   : content,
              simulation: simulation,
              defs      : { defPoly:  defPoly,
                            clipPoly: clipPoly,
                            gradient: gradient} } }


  var vertexColorScale  = d3.scaleLinear()
                            .domain([0,35])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("#D8DF00"), d3.rgb('#F600AA')])

  module.exports = {
    init            : initDOM }})()