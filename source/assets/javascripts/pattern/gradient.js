(function patternGradient() {

  var vector = require('../geom/vector')

  function initialize(dimensions, dom) {
    var gradient  = dom.defs.gradient
                      .append('svg:radialGradient')
                      .attr('id', 'gradient')
                      .attr('gradientUnits', 'userSpaceOnUse')
                      .attr('r', '100%')
                      .attr('spreadMethod', 'pad')

    gradient.append('stop')
      .attr('id', 'g-inner')
      .attr('offset', '0%')
      .attr('stop-color', '#fcfcfc')
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('id', 'g-front')
      .attr('stop-color', '#fcfcfc')
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('id', 'g-center')
      .attr('stop-color', '#5ca6b2')
      .attr('stop-opacity', 1)

    gradient.append('stop')
      .attr('id', 'g-back')
      .attr('stop-color', '#fcfcfc')
      .attr('stop-opacity', 1)

    gradient.append('stop')
      .attr('id', 'g-outer')
      .attr('offset', '100%')
      .attr('stop-color', '#fcfcfc')
      .attr('stop-opacity', 1)

    var longer = math.max(dimensions.x, dimensions.y)

    dom.gradientRect
      // .attr('x', -dimensions.x)
      // .attr('y', -dimensions.y)
      // .attr('width', 2 * longer)
      // .attr('height', 2 * longer)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.x)
      .attr('height', dimensions.y)
      .style('fill', 'url(#gradient)')

    return gradient }

  function click(gradient, dimensions, mouse) {
    var DURATION        = 3200,
        cornerDistance  = _( [{x:0,y:0},
                              {x:dimensions.x,y:0},
                              {x: dimensions.x,y:dimensions.y},
                              {x:0,y:dimensions.y}])
                            .map(function(corner) {
                              return vector.δ(mouse, corner) })
                            .max()
    cornerDistance *= 1.2

    gradient
      .attr('cx', mouse.x)
      .attr('cy', mouse.y)
      .attr('r', cornerDistance)


    gradient.select('#g-front')
      .attr('offset', '-2%')
      .transition()
      .duration(DURATION * 1.2)
      // .ease( d3.easePoly.exponent(2))
      // .ease( d3.easeLinear)
      .attr('offset', '98%')
      .on('end', function(){
        console.log('end')
      })

    gradient.select('#g-center')
      .attr('offset', '0%')
      .transition()
      .duration(DURATION)
      // .ease( d3.easePoly.exponent(2))
      // .ease( d3.easeLinear)
      .attr('offset', '100%')

    gradient.select('#g-back')
      .attr('offset', '2%')
      .transition()
      .duration(DURATION)
      // .ease( d3.easePoly.exponent(2))
      // .ease( d3.easeLinear)
      .attr('offset', '102%')

    // gradientRect
    //   .attr('transform', 'translate(' + mouse.x + ',' + mouse.y + ') scale(0)')
    //   .transition()
    //   .duration(2000)
    //   .ease(d3.easeLinear)
    //   .attr('transform', 'translate(' + mouse.x + ',' + mouse.y + ') scale(1)')

  }

  module.exports = {
    initialize: initialize,
    click: click
  }
})()
