

function _width(ε) { return $(ε.nodes()[0]).width() }
function _height(ε) { return $(ε.nodes()[0]).height() }
function _top(ε) { return ε.nodes()[0].getBoundingClientRect().top }

function init(η, index) {
  let l   = d3.select(η).select('ul').selectAll('li'),
      p   = _.reduce(l.nodes(), (ζ, n) => {
              ζ[d3.select(n).attr('data-key')] = d3.select(n).attr('data-value')
              return ζ }, {}),
      t   = d3.select(η).select('.description').html(),
      ς   = d3.scaleLinear().domain([0, 10]).range([2, 12]),
      svg = d3.select(η).append('svg')
              .attr('xmlns', 'http://www.w3.org/2000/svg')
              .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
              .attr('version', '1.2')
              .attr('baseProfile', 'tiny'),
      δ   = svg.append('svg:defs'),

      // filter
      f   = δ.append('svg:filter')
              .attr('id', 'filter-' + p.id)
              .append('svg:feColorMatrix')
              .attr('in', 'SourceAlpha')
              .attr('type', 'matrix')
              .attr('values', '0 0 0 0.5 0   0 0 0 0.5 0   0 0 0 0.5 0   0 0 0 1 0'),


      // attach the image to the defs
      ι   = δ.append('svg:image')
              .attr('id', 'logo-' + p.id)
              .attr('xlink:href', p.logo)
              .attr('x', 0)
              .attr('y', 24),

      // make the mask
      μ   = δ.append('svg:mask')
              .attr('id', 'mask-' + p.id)
              .attr('maskUnits', 'userSpaceOnUse')
              .attr('x', '0')
              .attr('y', '0')
              .attr('width', '100%')
              .attr('height', '100%'),

      // use the image inside the filter
      Ϟ   = μ.append('svg:use')
            .attr('xlink:href', '#logo-' + p.id)
            .attr('filter', 'url(#filter-' + p.id + ')'),

      // attach the text to the defs
      τ   = δ.append('svg:text')
              .attr('x', 0)
              .attr('y', 0)
              .attr('class', 'head')
              .attr('id', 'title-' + p.id)
              .text(p.title),

      φ   = svg.append('foreignObject')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 480)

  φ.append('xhtml:div')
    .attr('class', 'description')
    .html(t)

  // render the text without the mask
  svg.append('svg:use')
    .attr('xlink:href', '#title-' + p.id)
    .attr('fill', '#000000')

  // render the image
  svg.append('svg:use')
    .attr('xlink:href', '#logo-' + p.id)

  // render the text with the mask
  svg.append('svg:use')
    .attr('xlink:href', '#title-' + p.id)
    .attr('fill', '#ffffff')
    .attr('mask', 'url(#mask-' + p.id + ')')


  function _resize() {
    let w   = $(window).width(),
        h   = $(window).height()

    // resize the image so that it sits in the centre
    ι.attr('width', w * 0.24).attr('x', w * 0.18)

    let ιw  = _width(ι),
        ιh  = _height(ι),
        τw  = _width(τ),
        τh  = _height(τ),
        φw  = _width(φ),
        φh  = _height(φ)

    // position the head
    τ.attr('x', 16)
     .attr('y',  τh)

    // position the description
    φ.attr('x', w - φw - 16)
      .attr('y', 16)

    // set the size of the frame to fit the content
    svg.attr('height', h)

  }

  d3.timeout(_resize, 200)
  // Debounce to avoid costly calculations while the window size is in flux.
  $(window).on('resize', _.debounce(() => {_resize(svg)}, 150))

  function _scroll() {
    let ω   = _top(svg),
        h   = $(window).height(),
        ξh  = _height(svg),
        τh  = _height(τ),
        ς   = d3.scaleLinear()
                .domain([0, h])
                .range([τh, 0])

    τ.attr('y', ς(ω))
  }

  _scroll()
  $(window).on('scroll', _scroll)

}

export default init

