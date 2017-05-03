  let lineFunction  = d3.line()
                        .x( function( d ) { return d.x } )
                        .y( function( d ) { return d.y } )
                        .curve(d3.curveBasisClosed)

  function _renderPaths(svg, polygons, handlers) {
    let p = svg.selectAll('path').data(polygons)
    p.exit().remove()
    p.enter()
      .append( 'svg:path' )
          .on('click', handlers.click)
          .on('mouseenter', handlers.enter)
          .on('mouseexit', handlers.exit)
          .on('mousemove', handlers.move)
      .merge(p)
        .attr('d', function(d) {
          return lineFunction(d)}) }

  function _render(paths) {
    return function(polygons, nodes, handlers) {
      _renderPaths(paths, polygons, handlers) } }


  function _makeContent(svg, width, height) {
    svg.append('svg:text')
      .attr('x', width * 0.8 - 18)
      .attr('y', height * 0.2 + 18)
      .attr('class', 'menu icon')
      .attr('class', 'menu icon')
      .attr('clip-path', 'url(#clipp)')
      .text('\uE91A')
  }

  function init(parent, width, height) {
    let svg     = d3.select( parent )
                    .append( 'svg:svg' )
                    .attr('width', width)
                    .attr('height', height),
        paths   = svg.append('svg:g').attr('id', 'paths'),
        content = svg.append('svg:g').attr('id', 'content')

    // _makeContent(content, width, height)

    return { render: _render(paths) } }
  
  export default init
