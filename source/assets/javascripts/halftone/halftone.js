import config from './halftone-config'

let  CHANNELS = { None:     -1,
                  Red:       0,
                  Green:     1,
                  Blue:      2,
                  //Alpha: 3,
                  Luminance: 4,
                  Cyan:      5,
                  Magenta:   6,
                  Yellow:    7,
                  Black:     8 }


function _getLevel(imageData, x, y, ch) {
  if (ch < 0) return 0;

  x = x | 0;
  y = y | 0;

  let w = imageData.width,
    l = 0,
    R = imageData.data[(x + y * w) * 4],
    G = imageData.data[(x + y * w) * 4 + 1],
    B = imageData.data[(x + y * w) * 4 + 2],
    A = imageData.data[(x + y * w) * 4 + 3];

  switch (ch) {
    case 0: // Red
      l = R;
      break;
    case 1: // Green
      l = G;
      break;
    case 2: // Blue
      l = B;
      break;
    case 3: // Alpha
      l = A;
      break;
    case 4: // Luminance
      l = (0.299 * R + 0.587 * G + 0.114 * B);
      break;
    case 5: // Cyan
      l = (255 - R);
      break;
    case 6: // Magenta
      l = (255 - G);
      break;
    case 7: // Yellow
      l = (255 - B);
      break;
    case 8: // Black
      l = 255 - (0.299 * R + 0.587 * G + 0.114 * B);
      break;
  }

  l = l /255;

  // clamp and normalize
  if (l <= config.srcClampMin) {
    l = 0;
  } else if (l >= config.srcClampMax) {
    l = 1;
  } else {
    l = (l - config.srcClampMin) / (config.srcClampMax - config.srcClampMin);
  }

  // gamma
  if (config.srcGamma !== 1)
    l = Math.pow(l, config.srcGamma)

  // warp
  if (config.srcWarp !== 1 && l < 1)
    l = l * configsrcWarp % 1

  return l }

// extract the color channels from an image
// returns a promise
function _colorChannels(imgUrl, width) {
  return new Promise((resolve, _reject) => {
    let image = new Image()


    image.onload = function() {
      let canvas    = document.createElement('canvas'),
          context   = canvas.getContext('2d'),
          ratio     = image.width/image.height

      // scale down
      canvas.width  = width * config.sampleScale
      canvas.height = width/ratio * config.sampleScale

      // normalize to tile size
      canvas.width  = _.floor(canvas.width / config.tileSize) * config.tileSize
      canvas.height = _.floor(canvas.height / config.tileSize) * config.tileSize

      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      let imageData = context.getImageData(0, 0, canvas.width, canvas.height),
          // iterate the whole canvas and extract the Luminance value for each pixel
          // the resulting array are the rows
          // [ [row0: v(0), v(1), … v(canvas.width-1)] [row1] [row2] … ]
          levels    =  _.map(_.range(canvas.height), (y) => {
                        return _.map(_.range(canvas.width), function(x) {
                          return _getLevel(imageData, x, y, CHANNELS['Luminance']) }) }),

          tiles     = _.map(_.range(_.floor(canvas.height / config.tileSize)), () => {
                      return  _.map(_.range(_.floor(canvas.width / config.tileSize)), () => {
                        return [] }) })

      _.reduce(levels, (result, row, index) => {
        let rι = _.floor(index / config.tileSize)
        _(row)
          .chunk(config.tileSize)
          .each((chunkk, cι) => {
            result[rι][cι] = _.concat(result[rι][cι], chunkk) })
        return result
      }, tiles)

      // iterate the tiles ↓ row-wise
      let averages = _.map(tiles, (r) => {
        // iterate the row →
        return _.map(r, (τ) => {
          // calculate the average value for each tile
          return  _.reduce(τ, function(σ, v) {
            return σ + v },0) / τ.length }) })
      resolve({
        rows: _.floor(canvas.height / config.tileSize),
        columns: _.floor(canvas.width / config.tileSize),
        tiles: _.flatten(averages)}) }
    image.src = imgUrl })}

function _width(svg) { return parseInt(svg.style('width'))}

function _makeCircles(svg, group, {rows, columns, tiles}) {

  // calculate and attach the tile indices
  tiles = _.map(tiles, (τ, ι) => {
            let x = ι % columns,
            y = _.floor(ι / columns)
            return { v: τ, x: x, y: y} })

  let w0  = columns * config.tileSize,
      h0  = rows * config.tileSize,
      r   = w0 / h0,
      w1  = _width(svg),
      ς = d3.scaleLinear()
            .domain([0, w0])
            .range([0, w1])

  svg.style('height', (w1/r) + 'px')
  group.selectAll('circle')
    .data(tiles)
    .enter()
    .append('svg:circle')
      .attr('cx', (ζ) => { return ς(ζ.x * config.tileSize + config.tileSize/2) })
      .attr('cy', (ζ) => { return ς(ζ.y * config.tileSize + config.tileSize/2) })
      .attr('r',  (ζ) => { return (1 - ζ.v) * (config.tileSize * 1.4) })
}

function makeHalftoneImage(svg, group, imgUrl) {
  return _colorChannels(imgUrl, _width(svg))
    .then((tiles) => { _makeCircles(svg, group, tiles) })}

function blur(svg, blur) {
  svg.selectAll('circle')
    .attr('r',  (ζ) => {
      let ς = d3.scaleLinear()
                .domain([0, 1])
                .range([(1 - ζ.v), 4])
      return ς(blur) * (config.tileSize * 1.4)})}

export default {
  make: makeHalftoneImage,
  blur: blur
}

