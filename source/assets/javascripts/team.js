import halftone from './halftone/halftone-filter'

// function _uuid() {
//   // I generate the UID from two parts here
//   // to ensure the random number provide enough bits.
//   let firstPart   = (Math.random() * 46656) | 0,
//       secondPart  = (Math.random() * 46656) | 0;
//   firstPart = ('000' + firstPart.toString(36)).slice(-3)
//   secondPart = ('000' + secondPart.toString(36)).slice(-3)
//   return 'b2' + firstPart + secondPart }

function _width(ε) { return $(ε.nodes()[0]).width() }

function _height(ε) { return $(ε.nodes()[0]).height() }

function _resize(svg) {
  let w   = _width(svg), // the frame
      h,

      ι   = svg.select('image'),
      ιw  = _width(ι),
      ιh  = 2/3 * ιw,
      δ   = svg.select('foreignObject'), // description
      δw  = _width(δ),
      δh  = _height(δ.select('.description')),

      θ   = svg.select('.head'), // head
      θw  = _width(θ),
      θh  = _height(θ)

  svg.style('height', ιh + 'px')
  h = _height(svg)

  θ.attr('transform', 'translate(' + (w - θw - 16) + ',' + (h - δh - θh + 16) + ')')
  δ.attr('transform', 'translate(' + (w - δw - 16)  + ',' + (h - δh - 16) + ')')
}

function _make() {
  let l   = d3.select(this).select('ul').selectAll('li'),
      m   = _.reduce(l.nodes(), (ζ, n) => {
              ζ[d3.select(n).attr('data-key')] = d3.select(n).attr('data-value')
              return ζ }, {}),
      svg = d3.select(this).append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('version', '1.2')
        .attr('baseProfile', 'tiny')
        .attr('id', m.id),

      defs= svg.append('defs'),
      φ   = defs.append('svg:filter')
                .attr('id', m.id + '-phi')
                .attr('color-interpolation-filters', 'sRGB')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('x', '0')
                .attr('y', '0'),

      // μ =   φ.append('svg:feMorphology')
      //         .attr('in', 'SourceImage')
      //         .attr('operator', 'dilate')
      //         .attr('radius', 2)
      //         .attr('result', 'morphed')

      μ =   φ.append('svg:feGaussianBlur')
              .attr('in', 'SourceImage')
              .attr('stdDeviation', 2)
              .attr('result', 'morphed')

  φ = halftone(defs, φ, 'morphed')

  φ.append('svg:feColorMatrix')
    .attr('in', 'clipped')
    .attr('type', 'matrix')
    .attr('values', '0 0 0 0.39 0   0 0 0 0.71 0   0 0 0 0.75 0   0 0 0 1 0')
    .attr('result', 'colored')

  // attach the image
  svg.append('image')
    .attr('xlink:href', m.img)
    .attr('x', 0)
    .attr('y', 0)
    .attr('filter', 'url(#'+ m.id + '-phi)') // apply the filter
    // .style('width', '62%')
    .style('width', '100%')

  let gn  = svg.append('g')
              .attr('class', 'head'),
      name= gn.append('text')
              .attr('x', 0)
              .attr('y', 0)
              .attr('class', 'name')
              .attr('font-size', 60)
              .text(m.name),
      role= gn.append('text')
              .attr('x', 24)
              .attr('y', 30)
              .attr('class', 'role')
              .attr('font-size', 18)
              .text(m.role),
      f   = svg.append('foreignObject')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 320)
              .attr('height', 370),
      desc= f.append('xhtml:div')
              .attr('class', 'description')
              .text(m.description)

  $(window).on( 'scroll', () => {
    let h = $(window).height(),
        ω = svg.nodes()[0].getBoundingClientRect().top,
        δ = 64,
        ς = d3.scaleLinear()
            .domain([-h, 0, h])
            .range([δ, 0, δ])
    if(-h < ω && ω < h ) μ.attr('stdDeviation', ς(ω)) })

  _resize(svg)

  // halftone.make(svg, bg, m.img)
  //   .then(() => {
  //     _resize(svg)
  //     // _blur()
  //     // $(window).on( 'scroll', () => { _blur() } )
  // })
}

function init(selector) {
  d3.selectAll(selector).each(_make)
}

export default { init: init}

