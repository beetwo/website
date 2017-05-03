

function init(defs, φ, input) {

  let circles = [ { id: 'two',    r: '0.5', result: '2dot' },
                  { id: 'three',  r: '1', result: '3dot' },
                  { id: 'four',   r: '1.5', result: '4dot' },
                  { id: 'five',   r: '2', result: '5dot' },
                  { id: 'six',    r: '2.5', result: '6dot' },
                  { id: 'seven',  r: '3', result: '7dot' },
                  { id: 'eight',  r: '3.5', result: '8dot' }]

  _.each(circles, ({id, r, result}) => {
    // Generate circle templates
    defs.append('svg:circle')
      .attr('id', id)
      .attr('cx', '3')
      .attr('cy', '3')
      .attr('r', r)

    // Generate half-tone screens
    φ.append('svg:feImage')
      .attr('width', '3')
      .attr('height', '3')
      .attr('xlink:href', '#' + id)
      // .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    φ.append('svg:feTile')
      .attr('result', result)
  })

  // Generate luminance map
  φ.append('svg:feColorMatrix')
    .attr('in', input)
    .attr('result', 'neg-lum-map')
    .attr('type', 'luminanceToAlpha')

  φ.append('svg:feComponentTransfer')
    .attr('result', 'lum-map')
    .append('svg:feFuncA')
      .attr('type', 'table')
      .attr('tableValues', '1 0')

  let ll = [{ tableValues: '0 1 0 0 0 0 0 0', result: '2r-thresh'},
            { tableValues: '0 0 1 0 0 0 0 0', result: '3r-thresh'},
            { tableValues: '0 0 0 1 0 0 0 0', result: '4r-thresh'},
            { tableValues: '0 0 0 0 1 0 0 0', result: '5r-thresh'},
            { tableValues: '0 0 0 0 0 1 0 0', result: '6r-thresh'},
            { tableValues: '0 0 0 0 0 0 1 0', result: '7r-thresh'},
            { tableValues: '0 0 0 0 0 0 0 1', result: '8r-thresh'}]

  // Split luminance levels into separate images
  _.each(ll, ({tableValues, result}) => {
    φ.append('svg:feComponentTransfer')
      .attr('in', 'lum-map')
      .attr('result', result)
      .append('svg:feFuncA')
        .attr('type', 'discrete')
        .attr('tableValues', tableValues) })

  let c = [ { in1: '2r-thresh', in2: '2dot', result: 'lev2'},
    { in1: '3r-thresh', in2: '3dot', result: 'lev3'},
    { in1: '4r-thresh', in2: '4dot', result: 'lev4'},
    { in1: '5r-thresh', in2: '5dot', result: 'lev5'},
    { in1: '6r-thresh', in2: '6dot', result: 'lev6'},
    { in1: '7r-thresh', in2: '7dot', result: 'lev7'},
    { in1: '8r-thresh', in2: '8dot', result: 'lev8'}]

  // Composite screens with luminance levels
  _.each(c, ({in1, in2, result}) => {
    φ.append('svg:feComposite')
      .attr('in2', in2)
      .attr('in', in1)
      .attr('operator', 'in')
      .attr('result', result) })

  // Merge half-tone fragments together
  let μ = φ.append('svg:feMerge')
  _.each(_.reverse(c), ({result}) => {
    μ.append('svg:feMergeNode')
      .attr('in', result) })

  // Clip to the original
  φ.append('svg:feComposite')
    .attr('in2', 'SourceGraphic')
    .attr('operator', 'in')
    .attr('result', 'clipped')

  return φ
}

export default init


//
// %feimage{:height => "3", :width => "3", "xlink:href" => "#two", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "2dot"}
// %feimage{:height => "3", :width => "3", "xlink:href" => "#three", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "3dot"}
// %feimage{:height => "3", :width => "3", "xlink:href" => "#four", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "4dot"}
// %feimage{:height => "3", :width => "3", "xlink:href" => "#five", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "5dot"}
// %feimage{:height => "3", :width => "3", "xlink:href" => "#six", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "6dot"}
// %feimage{:height => "3", :width => "3", "xlink:href" => "#seven", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "7dot"}
// %feimage{:height => "3", :width => "3", "xlink:href" => "#eight", "xmlns:xlink" => "http://www.w3.org/1999/xlink"}
// %fetile{:result => "8dot"}
// / Generate luminance map
// /
// Tweak gamma levels
//
// <feComponentTransfer in="neg-lum-map" result="contrast-lum-map">
//   <feFuncA type="gamma" offset="-.1" amplitude="1.1" exponent="2">
//   <animate attributeName="exponent" values="1.8;2.2;1.8" dur="5s" repeatCount="10" />
//   </feFuncA>
//   </feComponentTransfer>
//   %fecolormatrix{:in => "SourceGraphic", :result => "neg-lum-map", :type => "luminanceToAlpha"}
// %fecomponenttransfer{:result => "lum-map"}
// %fefunca{:tablevalues => "1 0", :type => "table"}
// / Split luminance levels into separate images
// %fecomponenttransfer{:in => "lum-map", :result => "2r-thresh"}
// %fefunca{:tablevalues => "0 1 0 0 0 0 0 0", :type => "discrete"}
// %fecomponenttransfer{:in => "lum-map", :result => "3r-thresh"}
// %fefunca{:tablevalues => "0 0 1 0 0 0 0 0", :type => "discrete"}
// %fecomponenttransfer{:in => "lum-map", :result => "4r-thresh"}
// %fefunca{:tablevalues => "0 0 0 1 0 0 0 0", :type => "discrete"}
// %fecomponenttransfer{:in => "lum-map", :result => "5r-thresh"}
// %fefunca{:tablevalues => "0 0 0 0 1 0 0 0", :type => "discrete"}
// %fecomponenttransfer{:in => "lum-map", :result => "6r-thresh"}
// %fefunca{:tablevalues => "0 0 0 0 0 1 0 0", :type => "discrete"}
// %fecomponenttransfer{:in => "lum-map", :result => "7r-thresh"}
// %fefunca{:tablevalues => "0 0 0 0 0 0 1 0", :type => "discrete"}
// %fecomponenttransfer{:in => "lum-map", :result => "8r-thresh"}
// %fefunca{:tablevalues => "0 0 0 0 0 0 0 1", :type => "discrete"}
// / Composite screens with luminance levels
// %fecomposite{:in => "2r-thresh", :in2 => "2dot", :operator => "in", :result => "lev2"}
// %fecomposite{:in => "3r-thresh", :in2 => "3dot", :operator => "in", :result => "lev3"}
// %fecomposite{:in => "4r-thresh", :in2 => "4dot", :operator => "in", :result => "lev4"}
// %fecomposite{:in => "5r-thresh", :in2 => "5dot", :operator => "in", :result => "lev5"}
// %fecomposite{:in => "6r-thresh", :in2 => "6dot", :operator => "in", :result => "lev6"}
// %fecomposite{:in => "7r-thresh", :in2 => "7dot", :operator => "in", :result => "lev7"}
// %fecomposite{:in => "8r-thresh", :in2 => "8dot", :operator => "in", :result => "lev8"}
// / Merge half-tone fragments together
// %femerge
// %femergenode{:in => "lev8"}
// %femergenode{:in => "lev7"}
// %femergenode{:in => "lev6"}
// %femergenode{:in => "lev5"}
// %femergenode{:in => "lev4"}
// %femergenode{:in => "lev3"}
// %femergenode{:in => "lev2"}
// / Clip to the original
// %fecomposite{:in2 => "SourceGraphic", :operator => "in", :result => "clipped"}
// %feColorMatrix{:in => "clipped", :type => "matrix", :values => "0 0 0 0.39 0   0 0 0 0.71 0   0 0 0 0.75 0   0 0 0 1 0"}
