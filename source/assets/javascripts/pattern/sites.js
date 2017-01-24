(function patternSites() {

  var config = require('../config')
  
  function initialize({dom, sites}) {
    dom.site
      .selectAll('circle')
      .data(sites)
      .enter()
        .append('svg:circle')
          .attr('grid-index', function(d) { return d.index })
          .attr('class', function(d) { return 's-' + d.index})
          .attr('r', function(d) { return 4 })
  }
  
  function update({dom, sites}) {
    dom.site
      .selectAll('circle')
      .data(sites)
      .transition()
        .duration(config.TRANSITION_DURATION)
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y }) }

  module.exports = {
    initialize: initialize,
    update    : update
  }
})()