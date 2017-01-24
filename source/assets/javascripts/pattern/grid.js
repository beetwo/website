(function patternGrid() {

  var d3        = require('d3'),
      vector    = require('victor'),
      util      = require('./util'),
      config    = require('../config'),
      simplex   = require('simplex-noise'),

      noize     = new simplex(math.random)

  function _getVicinity(x, y, cellW, cellH, frameW, frameH) {
    // console.log('_getVicinity', 'x:', x, 'y:', y)

    var top       = y < (cellH/2),
        right     = x > frameW - (cellW/2),
        bottom    = y > frameH - (cellH/2),
        left      = x < (cellW/2),
        vicinity  = (top || right || bottom || left) ? ['border'] : ['inner'],
        result

    if(top)     vicinity.push('top')
    if(right)   vicinity.push('right')
    if(bottom)  vicinity.push('bottom')
    if(left)    vicinity.push('left')

    result = _.join(vicinity, ' ')
    return result }

  // convoluted closure which —in essence— lines up the candidates for receiving content
  // beginning from the top left and counting to the right
  function _ςCounter(colN, rowN) {
    // console.log('_ςCounter', colN)
    var ςount       = 0,
        ςonsidered  = 0,
        f           = function(index, vicinity) {
                        var ϱ = ςount

                        // only consider inner nodes
                        // if( !_.isEqual(vicinity, 'inner') && index > 0) return null
                        if( !_.isEqual(vicinity, 'inner')) return null
                        
                        // ςonsidered += 1
                        // // skip the first candidate row
                        // if(ςonsidered < colN) return null

                        ςount += 1

                        return ϱ
                      }

    return f }

  function _getIndex(x, y, colN) {
    return y * colN + x }

              
  function _widthinBounds({baseX, baseY}, width, height, cellWidth, cellHeight) {
    if(baseX > width + 0.6 * cellWidth)   return false
    if(baseX < -0.6 * cellWidth)          return false
    if(baseY > height + 0.6 * cellHeight) return false
    if(baseY < -0.6 * cellHeight)         return false
    return true }

 //             _
 //  _ __  __ _| |_____
 // | '  \/ _` | / / -_)
 // |_|_|_\__,_|_\_\___|
  function makeGrid(dimensions) {
    var
      width       = dimensions.x,
      height      = dimensions.y,
      resScale    = d3.scaleLinear()
                      .domain([0, 3])
                      .rangeRound([config.GRID_RESOLUTION_MIN, config.GRID_RESOLUTION_MAX]),
      res         = resScale(width/height),
      RATIO       = 0.865769444,
      cellWidth   = width / res,
      cellHeight  = cellWidth * RATIO,
      xs          = _(res + 2)
                      .range()
                      .map(function(i) { 
                        var ϱ = (i * cellWidth) 
                        if(ϱ === 0) ϱ = 1 // if ϱ is 0, everything explodes… ¯\_(ツ)_/¯ 
                        return ϱ }),

      ys          = _.map(_.range( 0, (height / cellHeight) + 1 ), function(i) { return i * cellHeight}),
      sites       = [],
      x,y,s,v,i,ς,
      ςount       = _ςCounter(_.size(xs), _.size(ys)) // counter function for keeping track of potential content nodes

    ys.forEach(function(yValue, yIndex) {
      xs.forEach(function(xValue, xIndex) {

        x = (yIndex % 2 == 0) ? math.round(xValue) : math.round(xValue - cellWidth/2)
        y = yValue
        v = _getVicinity(x, y, cellWidth, cellHeight, width, height)
        i = _getIndex(xIndex, yIndex, _.size(xs))
        // assign contentIndex
        ς = ςount(i, v)
        s = { x:          config.GRID_RANDOMIZE ? math.random(width)  : x,
              y:          config.GRID_RANDOMIZE ? math.random(height) : y,
              baseX:      x,
              baseY:      y,
              dimensions: { x: cellWidth, y: cellHeight },
              vicinity:   v,
              index:      i,
              ςIndex:     ς }

        // if( _.isEqual(v, 'inner') ) console.log('i', i, 'ς', ς)
        // console.log('index:', i, ' | row col:', yIndex, ' ', xIndex,  ' | x:', x, ', y: y')
        // console.log(yIndex, 'x', xIndex, 'i', i, 'ς', ς, 'v', v)
        // console.log(yIndex, 'x', xIndex, 'i', i, x, 'x', y)

        if( _widthinBounds(s, width, height, cellWidth, cellHeight) ) sites.push(s)
      })})



    // assign an index for being able to keep track of the initial sorting 
    sites = _.map(sites, function(site, index) { 
                          site.index = index
                          return site })
    return sites } 

  function findClosestSite(sites, mouseV) {
    var closest = _(sites)
                    .map(function(s) {
                      var v = new vector(s.x, s.y)
                      v.subtract(mouseV)
                      return {v: v, s: s}})
                    .sortBy(function({v}) {
                      return v.length()})
                    .first()
                    .s

    if(closest.derivedFrom) 
      closest = _.find(sites, function(s) { return s.index === closest.derivedFrom })
    return closest }

  module.exports = { 
    make        : makeGrid} })()
