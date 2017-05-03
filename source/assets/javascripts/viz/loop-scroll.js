
// check what requestAnimationFrame to use
let loop =  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame

function init(parent, segments) {

  function _scroll(prevTop, jumpId) {

    // if we get a jumpId, that means that in the previous loop
    // we did shuffle our elements and now need to to adjust the viewport
    if(jumpId) {
      let h = $('#' + jumpId).outerHeight()
      console.log('jump', jumpId, prevTop)
      $(window).scrollTop(prevTop + h)
      return loop(() => {_scroll(prevTop + h)})
    }

    let top   = $(window).scrollTop(),
        δTop  = top - prevTop,
        wh    = $(window).height(),
        σ     = $(parent + ' > ' + segments)

    // scolling downwards
    if(δTop > 0) {
      console.log('down', top, δTop)

      // get all segments above the viewport and put them below it
      // _(σ).filter((ς) => {
      //   let ρ = ς.getBoundingClientRect()
      //   return ρ.top + ρ.height < 0 })
      //   .each((ς) => {
      //     console.log('ς above', ς)
      //     $(ς).detach().appendTo('.pusher')
      //   })
    }

    // scolling upwards
    if(top === 0 || δTop < 0){
      // if we are on the first segment (ie there is no segment above the viewport)
      // get the last one and move it above
      if(top < wh) {
        let f = $(σ).first(),
            l = $(σ).last()
        console.log('mpve up')
        l.detach().prependTo('.pusher')
        loop(() => {_scroll(top, f.attr('id'))})
        // $(window).scrollTop(top + l.outerHeight())

      }

    }

    // if($(window).scrollTop() !== top)
    //   console.log('old top', top, 'new top', $(window).scrollTop())

    // repeat
    loop(() => {_scroll(top)})
  }

  _scroll($(window).scrollTop())
}

export default init

