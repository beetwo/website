(function patternDOM() {

  var 
    d3        = require('d3'),
    util      = require('./util'),
    config    = require('../config')

  function _frameScale(all, w, h) {
    var scale = config.FRAME_SCALE,
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
    var 
        width         = $(parentId).width(),
        height        = $(parentId).height(),
        vis           = d3.select(parentId).append('svg:svg'),
  
        defs          = vis.append('svg:defs'),
        shadowz       = defs.append('svg:g').attr('id', 'shadowz'),
        defPoly       = defs.append('svg:g').attr('id', 'poly'),
        clipPoly      = defs.append('svg:g').attr('id', 'clip-poly'),
        gradient      = defs.append('svg:g'),
  
        gradientRect  = vis.append('svg:rect').attr('class', 'gradient'),
        all           = vis.append('svg:g').attr('id', 'everything'),
        polygon       = all.append('svg:g').attr('class', 'polygons'),
        simulation    = all.append('svg:g').attr('class', 'simulation'),
        content       = all.append('svg:g').attr('class', 'content')

    require('./filter').initShadowz(shadowz)
    
    _frameScale(all, width, height)


    return  { vis         : vis,
              gradientRect: gradientRect,
              polygon     : polygon,
              content     : content,
              simulation  : simulation,
              defs        : { shadowz:  shadowz,
                              defPoly:  defPoly,
                              clipPoly: clipPoly,
                              gradient: gradient} } }


  var vertexColorScale  = d3.scaleLinear()
                            .domain([0,35])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("#D8DF00"), d3.rgb('#F600AA')])

  module.exports = {
    init            : initDOM }})()