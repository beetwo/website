import util from '../util'

export default function(bb) {
  var nodes,
      boundingBox = bb || {x: 0, y: 0, w: 0, h: 0},
      padding = 0.1

  function force(alpha) {
    _.each(nodes, function(n) {
      
      if(n.x < boundingBox.x - padding * boundingBox.w) 
        n.x = boundingBox.x + (1 + padding) * boundingBox.w
      
      if(n.y < boundingBox.y  - padding * boundingBox.h) 
        n.y = boundingBox.y + (1 + padding) * boundingBox.h

      if(n.x > boundingBox.x + (1 + padding) * boundingBox.w) 
        n.x = boundingBox.x - padding * boundingBox.w

      if(n.y > boundingBox.y + (1 + padding) * boundingBox.h) 
        n.y = boundingBox.y - padding * boundingBox.h

    })
    // console.log('% boundingBox', boundingBox)
    // for (var i = 0, n = nodes.length, node; i < n; ++i) {
    //   node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
    // }
  }

  function initialize() {}

  force.initialize = function(_) {
    nodes = _
    initialize() }

  force.boundingBox = function(_) {
    return arguments.length ? boundingBox = _ : boundingBox }

  force.padding = function(_) {
    return arguments.length ? padding = _ : padding }

  return force;
}
