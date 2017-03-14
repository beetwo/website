(function patternContent() {

  var d3          = require('d3'),
      config      = require('../config'),
      vector      = require('../vector'),
      util        = require('./util')


  // load content from DOM
  // ————————————————————————————————
  function _load(contentId) {
    var content = _($(contentId).find('[cell]'))
                    .map(function(c) {
                      var result = {}
                      $(c).each(function() {
                        $.each(this.attributes, function() {
                          if(this.specified) result[this.name] = this.value })})
                      return result })
                    .value()
    return content }

  // sp|it a string into an array of lines
  // ————————————————————————————————
  function _splitIntoLines(text, charPerLine) {
    var  words        = text.split(/\s+/),
         charCount    = _.size(text),
         numLines     = math.floor(charCount/charPerLine),
         lineCount    = 0,
         lines        = _(words)
                          .reduce(function(result, w) {
                                    result[lineCount].push(w)
                                    var line = _.join(result[lineCount], ' ')
                                    if(line.length > charPerLine) {
                                      result.push([])
                                      lineCount++ }
                                    return result }, [[]])
                          .map(function(words) {
                                return _.join(words, ' ')})
                          // .map(function(lines) {
                                // return lines.split(/\\n/)})
                          .filter(function(line) {
                                return line !== ''})
    return lines }

  // intialize the head
  // ————————————————————————————————
  function _fitHead(node, numChars) {
    var width       = $(this).width(),
        scale       = node.content.type === 'head' ? 0.75 : 0.36,
        fontSize    = parseInt(d3.select(this).style('font-size').replace('px', ''))
    
    var ratio       = scale * node.dimensions.x / width,
        newSize     = math.round(fontSize * ratio)

    

    d3.select(this)
      .style('font-size', newSize + 'px')
      .attr('transform', 'translate(0,' + newSize/4 + ')') }


  function _mouse(self) {
    return vector.fromArray(d3.mouse(self)) }

  function _head(node) {
    var lines     = _splitIntoLines(node.content.text, config.HEAD_MAX_LINE_CHARS),
        numChars  = _(lines)
                      .map(function(l) { return _.size(l) })
                      .sortBy()
                      .last(),
        head      = d3.select(this)
                      .append('svg:text')
                      .attr('class', 'head')
                      .attr('id', 'head-' + node.content.id)
                      .attr('x', 0)
                      .attr('y', 0)
    _.each(lines, function(line, index) {
      head.append('svg:tspan')
            .text(line)
            .attr('text-anchor', 'middle') 
            .attr('x', 0) 
            .attr('dy', 16 * index) 
          })

    head.each(_fitHead, numChars) }

  function _body(node) {
    var content = node.content
    if(!content.tagline) return

    var body  = d3.select(this).append('svg:g').attr('class', 'body'),
        lines, tagline, link, yOffset, scaleΦ,
        height = $(this).height()

    lines   = _splitIntoLines(content.tagline, 24)
    tagline = d3.select(this)
                  .append('svg:text')
                  .attr('class', 'tagline')
    _.each(lines, function(line, index) {
      tagline.append('svg:tspan')
              .text(line)
              .attr('text-anchor', 'middle')
              .attr('x', 0)
              .attr('y', height/3)
              .attr('class', 'tagline')
              .attr('dx', 0)
              .attr('dy', config.CELL_FONT_SIZE * 1.2 * (index + 2) )})}

  function _initDom(nodes, dom) {
    var g = dom
              .selectAll('g.cell')
              .data(nodes)
              .enter()
                .append('svg:g')
                  .attr('class', 'item')
                  .attr('id', function(n){ return 'c-' + n.content.id })
                  .attr('index', function(n){ return n.index })
                  .attr('transform', function(n) { 
                    return 'translate(' + n.baseX + ',' + n.baseY + ')' })
                  .each(_head)
                  .each(_body)
                  .attr('clip-path', function(n){ return 'url(#clip-' + n.index + ')'})
                  
    return g }
  
  //            _    _ _        _   ___ ___
  //  _ __ _  _| |__| (_)__    /_\ | _ \_ _|
  // | '_ \ || | '_ \ | / _|  / _ \|  _/| |
  // | .__/\_,_|_.__/_|_\__| /_/ \_\_| |___|
  // |_|
  function initialize(contentId, simulationNodes, dom) {
    var
        // load the content from the dom
        content = _load(contentId),
        // randomly select size(content) inner nodes
        nodes   = _(simulationNodes)
                    .filter(function(n){ 
                      return _.isNumber(n.ςIndex)})
                    // .sortBy(function(n) { return n.ςIndex})
                    .take(_.size(content))
                    .value(),
        // prepare the result hash
        result  = { nodes: nodes }

    // attach a content item to each of the selected nodes
    _.each(nodes, function(n, i) { n.content = content[i] })

    // initialize the dom
    _initDom(nodes, dom.content)
    
    return result }

  

  module.exports = {
    initialize: initialize}
  })()