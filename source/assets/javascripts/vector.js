(function Vector() {

  function add(v0, v1) {
    var x = v0.x + v1.x,
        y = v0.y + v1.y
    return {x: x, y: y} }

  function subtract(v0, v1) {
    var x = v0.x - v1.x,
        y = v0.y - v1.y
    return {x: x, y: y} }

  function multiply(v0, v1) {
    var x = v0.x * v1.x,
        y = v0.y * v1.y
    return {x: x, y: y} }

  function divide(v0, v1) {
    var x = v0.x / v1.x,
        y = v0.y / v1.y
    return {x: x, y: y} }

  function lengthSq(vec) {
    return vec.x * vec.x + vec.y * vec.y }

  function length(vec) {
    return math.sqrt(lengthSq(vec)) }

  function normalize(vec) {
    var l = length(vec)
    if(l === 0) return [1,0]
    else        return divide(vec, [l, l]) }

  function scale(vec, scalar) {
    return [vec.x * scalar, vec.y * scalar] }

  function unfloat(vec) {
    return [math.round(vec.x), math.round(vec.y)] }

  function dot(v0, v1) {
    return v0.x * v1.x + v0.y * v1.y }

  function cross(v0, v1) {
    return (v0.x * v1.y ) - (v0.y * v1.x ) }

  function δSq(v0, v1) {
    return lengthSq(subtract(v1, v0)) }

  function δ(v0, v1) {
    return Math.sqrt(δSq(v0, v1)) }

  function fromArray(a) {
    return {x: a[0], y: a[1]} }

  function toArray(v) {
    return [v.x, v.y] }
  
  module.exports = {
    add:        add,
    subtract:   subtract,
    multiply:   multiply,
    divide:     divide,
    normalize:  normalize,
    length:     length,
    lengthSq:   lengthSq,
    scale:      scale,
    δ:          δ,
    δSq:        δSq,
    fromArray:  fromArray,
    toArray:    toArray }
})()