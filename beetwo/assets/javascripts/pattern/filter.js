(function patternFilter() {

  var util = require('./util')
  
  function shadows(dom) {
    var filter    = dom
                      .append('filter')
                        .attr('id', 'cell-shadow')
                        .attr('class', 'shadow')
                        .attr('height', '130%')
        
    filter.append('feOffset')
      .attr('in', 'SourceAlpha')
      .attr('dx', 2)
      .attr('dy', 2)
      .attr('result', 'offset')

    filter.append('feColorMatrix')
      .attr('in', 'offset')
      .attr('type', 'matrix')
      .attr('values', util.color2Matrix(d3.rgb('#c0c0c0')))
      .attr('result', 'matrix')

    filter.append('feGaussianBlur')
      .attr('in', 'matrix')
      .attr('stdDeviation', 4)
      .attr('result', 'blur')

    var feMerge   = filter.append('svg:feMerge')
    feMerge.append('feMergeNode').attr('in', 'blur' )
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic') }

  module.exports = { initShadowz: shadows }})()