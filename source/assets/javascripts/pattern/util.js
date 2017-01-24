(function patternUtil() {

  var 
    d3      = require('d3'),
    math    = require('mathjs'),
    vector  = require('victor')

  function sortByX(p) { return p.x }
  function sortByY(p) { return p.y }

  function findStart(points) {
    // var debug = _.map(points, function(p){return '{x:' + math.round(p.x) + ',y:' + math.round(p.y) + '}' })
    // console.log('findStart')
    // console.log(_.join(debug, ', '))

    // var minX  = _(points)
    //             .map(function(p) {return p.x})
    //             .min(),
    //     minY  = _(points)
    //             .map(function(p) {return p.y})
    //             .min(),
    //     start = _.find(points,
    //               function(p) {
    //                 return _.isEqual(p.x, minX) && _.isEqual(p.y, minY) })
    // console.log('minX', minX, 'minY', minY)
    // console.log('start', start)

    var
      νPoints = _(points)
                  .sortBy([sortByY,sortByX])
                  .value()

    // debug = _.map(νPoints, function(p){return '{x:' + math.round(p.x) + ',y:' + math.round(p.y) + '}' })
    // console.log('νPoints')
    // console.log(_.join(debug, ', '))

    return _.first(νPoints)
  }

  function sortPoints(points) {
    var 
      start   = findStart(points),
      tlIndex = _.findIndex(points, 
                  function(p) { return _.isEqual(start, p) }),
      head    = _.slice(points, 0, tlIndex),
      tail    = _.slice(points, tlIndex),
      result  = _.concat(tail, head)

    result.data = points.data
    return result  }

  function resample(points) {
    if(!points) return null;
    var 
      p0, p1, i0, i1,
      centroid      = points.data,
      n             = _.size(points),
      newPoints     = _.chain(n)
                        .range()
                        .reduce(function(result, i) {
                                  p0 = points[i]
                                  p1 = points[(i+1)%n]
                                  i0 = vector.fromObject(d3.interpolate(p0, p1)(0.19))
                                  i1 = vector.fromObject(d3.interpolate(p0, p1)(0.81))
                                  result.push(i0, i1, p1);
                                  // result.push(p1)
                                  return result
                                }, [])
                        .map(function(v) { return v.unfloat() })
                        .value()
    newPoints.data = points.data
    return newPoints
  }

  function vectorize(points) {
    var pointz = _.map(points, function(p) { return new vector(p[0], p[1]) })
    pointz.data = new vector(points.data[0], points.data[1]).unfloat()
    return pointz
  }

  function devectorize(points) {
    var pointz = _.map(points, function(p) { 
      return [p.x, p.y] })
    pointz.data = [points.data.x, points.data.y]
    return pointz
  }

  function radToDeg(rad) { return math.round(rad *  180 / math.pi) }

  function degToRad(deg) { return deg * math.pi / 180 }

  function pretty(obj) { return JSON.stringify(obj, null, 2)}

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1) }
    // return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() 
    return s4()
  }

  function average(array) {
     return _.reduce(array, function(avg,v) {return avg + v/array.length},0) }

  function polygonWidth(site) {
    var 
      min = math.min(_.map(site.polygon, function(p) { return p.x })),
      max = math.max(_.map(site.polygon, function(p) { return p.x }))
    return max - min }

  function polygonHeight(site) {
    var 
      min = math.min(_.map(site.polygon, function(p) { return p.y })),
      max = math.max(_.map(site.polygon, function(p) { return p.y }))
    return max - min }

  module.exports = {
    vectorize     : vectorize,
    devectorize   : devectorize,
    resample      : resample,
    // sort          : sortClockwise,
    sort          : sortPoints,
    pretty        : pretty,
    radToDeg      : radToDeg,
    degToRad      : degToRad,
    guid          : guid,
    average       : average,
    polygonWidth  : polygonWidth,
    polygonHeight : polygonHeight
  }

})();