import SVGMorpheus from './viz/svg-morpheus'

let COLORS = {yellow: "#ffdb69",
              orange: "#ff9e4f",
              red:    "#ff6b67",
              // purple: "#655e7e",
              blue:   "#5ca6b2",
              green:  "#a6c85d",
              // pink:   "#FF47AA"
            }
            
function init() {
  // no menu
  // if ($('#sidebar').length === 0) return

  let tocOptions = {iconId:   'burger',
                    duration: 400,
                    rotation: 'none' },
      tocButton  = new SVGMorpheus('#toc > #iconset', tocOptions),
      color      = _.sample(_.keys(COLORS)),
      hexColor   = COLORS[color]

  $('#sidebar')
    .sidebar({
      dimPage: false,
      onVisible: () => {
        tocButton.to('close')
        $('#toc').addClass('open') },
      onHide: () => {
        tocButton.to('burger')
        $('#toc').removeClass('open') }})
    .sidebar('attach events', '#toc')
    .sidebar('attach events', '#sidebar  a')

  //   $('#toc').css('background', hexColor)
  //   $('#sidebar').css('background', hexColor)
  //   $('#sidebar .item').addClass(color)
  }

export default {init: init}