
function _width(ε) { return $(ε.nodes()[0]).width() }
function _height(ε) { return $(ε.nodes()[0]).height() }
function _top(ε) { return ε.nodes()[0].getBoundingClientRect().top }



function init(selector) {
  let ς = d3.selectAll(selector)
  _.each(ς.nodes(), (η) => {
    η = d3.select(η)

    let ξ = η.text(), // read the content of the container
        Ϟ = η.text(''), // clear the content of the container
        ζ = η.append('svg:svg'),
        τ = ζ.append('svg:text')
              .text(ξ)

    function _scroll() {
      let w   = $(window).width(),
          h   = $(window).height(),
          ω   = _top(ζ),
          wτ  = _width(τ),
          ς   = d3.scaleLinear()
            .domain([0, h])
            .range([-0.38*wτ, w-(0.38*wτ)])
        τ.attr('x', ς(ω)) }

    function _resize() {
      ζ.style('height', _height(τ) * 1.2)
      τ.attr('y', _height(τ)) }

    $(window).on( 'scroll', _scroll)
    $(window).resize(_resize)

    _scroll()
    _resize()
  })


}

export default init

