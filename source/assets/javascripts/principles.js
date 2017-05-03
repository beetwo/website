function _offset(svg) {
  let svgOffset = $(svg.nodes()[0]).offset().top
  return $(window).scrollTop() - svgOffset + $(window).height() }

function _height() { return 1 *  $(window).height() }

function _resize(svg) {
  let height  = _.reduce(svg.selectAll('text').nodes(), (ω, τ) => {
                  // let w = $(τ).width(),
                  //     ς = parseInt($(τ).css('font-size')),
                  //     ρ = width / w,
                  //     σ = Math.floor( ς * ρ )
                  //
                  // $(τ).css('font-size', `${σ}px`).attr('x', 0)
                  ω = ω + $(τ).height()
                  $(τ).attr('y', ω)
                  return  ω }, 0)

  svg
    .selectAll('text')
    .attr('x', $(window).width() * 0.81)


  svg.attr('height', _height()) }

function _scroll(svg, offset) {
  let ω = { width:  $(window).width(),
            height: $(window).height() },
      ϕ = svg.selectAll('text').nodes(),
      // δ = _height() + $(window).height(),
      δ = _height(),
      σ = d3.scaleQuantize()
            .domain([0, δ])
            .range(_.range(ϕ.length))

  _.each(svg.selectAll('text').nodes(), (τ, ι) => {
    console.log('f00', ι, σ(offset))

    if(σ(offset) !== ι)
      return d3.select(τ).attr('x', $(window).width() * 0.81)

    let w = $(τ).width(),
        ς = d3.scaleLinear()
              .domain([0, 1])
              .range([ω.width, -w])

    d3.select(τ).attr('x', ς(offset))
  })


}


function init(selector) {
  let svg         = d3.select(selector).append('svg'),
      ρ           = d3.selectAll(`${selector} > ul > li`),
      principles  = _.map(ρ.nodes(), (η) => { return d3.select(η).html() })

  // randomize
  principles = _.shuffle(principles)

  svg
    .selectAll('text')
    .data(principles)
    .enter()
    .append('text')
    .attr('class', 'principle')
    .text(function(d) { return d })

  _resize(svg)
  // Debounce to avoid costly calculations while the window size is in flux.
  $(window).on('resize', _.debounce(() => {_resize(svg)}, 150))

  // the position of the svg frame relative to the beginning of the document

  _scroll(svg, _offset(svg))

  $(window).on('scroll', () => { _scroll(svg, _offset(svg)) })
}

export default { init: init}

