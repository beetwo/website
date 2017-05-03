(function patternHexagons() {

  var d3      = require('d3'),
      vector  = require('../../geom/vector'),
      config  = require('../../config'),
      util    = require('../util')

  function _unfloat(v) {
    return [math.round(v[0]), math.round(v[1])]}

  function _resample(polygon) {
    if(!polygon) return null;
    var 
      p0, p1, i0, i1,
      centroid      = polygon.data,
      n             = _.size(polygon),
      // create the new polygon by interpolating between each segment
      νPolygon     = _.chain(n)
                        .range()
                        .reduce(function(result, i) {
                                  p0 = polygon[i]
                                  p1 = polygon[(i+1)%n]
                                  i0 = d3.interpolate(p0, p1)(0.19)
                                  i1 = d3.interpolate(p0, p1)(0.81)
                                  result.push(i0, i1, p1);
                                  return result }, [])
                        .map(function(v) { return _unfloat(v) })
                        .value()
    // copy the centroid
    νPolygon.data = _unfloat(polygon.data)
    return νPolygon }

  function _updateDef({polygon}) {
    if(_.isNil(polygon)) 
      d3.select(this).attr('d', '')
    else {
      var svgPath = config.POLYGON_LINE(polygon)
      d3.select(this)
        .attr('transform', function(d) { 
            return 'translate(' + d.polygon.data[0] + ',' + d.polygon.data[1] + ') scale(' + config.POLYGON_SCALE + ')'})  
        .attr('d', svgPath) }}

  function _updateClip({polygon}) {
    if(_.isNil(polygon)) 
      d3.select(this).select('path').attr('d', '')
    else {
      var svgPath = config.POLYGON_LINE(polygon)
      d3.select(this)          
        .attr('transform', function(d, i) { 
            return 'translate(' + d.offset.x + ',' + d.offset.y + ') scale(0.94)'})  
        .select('path')
          .attr('d', svgPath)
          .attr('cursor', 'pointer'  ) 
    }
  }

  function _updateUse({focus}) {
    d3.select(this)
      .attr('in-focus', _.isNil(focus) ? null : 1 )
      // .style('cursor', _.isNil(focus) ? 'auto' : 'pointer' )
     
  }

  function _update(simulationNodes) {
    var 
        // prepare the simulation nodes
        σ     = _(simulationNodes)
                  .filter(function(s){ return s.vicinity !== 'mouse'})
                  .map(function(s){ return [s.x, s.y]})
                  .compact()
                  .value(),
        
        // update the diagram
        δ     = this.voronoi(σ),
        φ     = δ.polygons(),
        γ     = δ.cells,

        // generate the sites (which will be used for rendering)
        // by augmenting the simulation nodes with data from the diagram.cells & the diagram.polygons
        sites = _.map(γ, function(cell, i) {
          if(_.isNil(cell)) return {index: i}
          var site      = cell.site,
              index     = site.index,
              polygon   = φ[index],
              νPolygon  = null,
              node      = simulationNodes[index],
              offset    = { x: node.x - node.baseX,
                            y: node.y - node.baseY }

          if( !_.isNil(polygon) ) {
            νPolygon = _.map(polygon, function(p){
                          var x = p[0] - polygon.data[0],
                              y = p[1] - polygon.data[1]
                          return [x, y]})
            νPolygon.data = polygon.data
            if(config.RESAMPLE) νPolygon = _resample(νPolygon)
            node.polygon  = νPolygon }

          node.offset   = offset 
          
          return node }),

        contentSites = _.filter(sites, function(n){ 
          return !_.isNil(n.content)})

    this.polygons.def
      .data(sites)
      .each(_updateDef)

    this.polygons.use
      .data(sites)
      .each(_updateUse)

    this.polygons.clip
      .data(contentSites)
      .each(_updateClip)
  }

  function initialize(dimensions, simulationNodes, dom) {
    var ε         =  200,
        hexagons  = { voronoi: d3.voronoi().extent([[-ε, -ε], [dimensions.x + ε, dimensions.y + ε]]) }
    hexagons.update   = _update
    hexagons.polygons = require('./render').initialize(simulationNodes, dom)
    return hexagons }


  module.exports = { 
    initialize : initialize,
  }})()
