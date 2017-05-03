
  function add(v0, v1) {
    let x = v0.x + v1.x,
      y = v0.y + v1.y
    return {x: x, y: y} }

  function subtract(v0, v1) {
    let x = v0.x - v1.x,
      y = v0.y - v1.y
    return {x: x, y: y} }

  function multiply(v0, v1) {
    // if v1 is a scalar, multiply both x and y of the first vector with it
    if(_.isNumber(v1))
      return {x: v0.x * v1, y: v0.y * v1}

    let x = v0.x * v1.x,
      y = v0.y * v1.y
    return {x: x, y: y} }

  function divide(v0, v1) {
    let x = v0.x / v1.x,
      y = v0.y / v1.y
    return {x: x, y: y} }

  function lengthSq(vec) {
    return vec.x * vec.x + vec.y * vec.y }

  function length(vec) {
    return math.sqrt(lengthSq(vec)) }

  function distanceSq(v0, v1) {
    return lengthSq(subtract(v0, v1))}

  function distance(v0, v1) {
    return math.sqrt(distanceSq(v0, v1)) }

  function normalizeTo(vec, δ) {
    let l = length(vec)
    if(l === 0) return {x: δ, y: 0}
    else        return multiply(vec, δ/l) }

  function normalize(vec) {
    return normalizeTo(vec, 1)}

  function scale(vec, scalar) {
    return { x: vec.x * scalar,
      y: vec.y * scalar }}

  function unfloat(vec) {
    return { x: math.round(vec.x),
      y: math.round(vec.y) }}

  function dot(v0, v1) {
    return v0.x * v1.x + v0.y * v1.y }

  function cross(v0, v1) {
    return (v0.x * v1.y ) - (v0.y * v1.x ) }

  function δSq(v0, v1) {
    return lengthSq(subtract(v1, v0)) }

  function δ(v0, v1) {
    return Math.sqrt(δSq(v0, v1)) }

  function limit(v, l) {
    if(lengthSq(v) > math.square(l))
      return normalizeTo(v, l)
    else return v }

  function interpolate(v0, v1, i) {
    let δ = subtract(v1, v0),
      σ = multiply(δ, i),
      ρ = add(v0, σ)
    return ρ }

  function fromArray(a) {
    return {x: a[0], y: a[1]} }

  function toArray(v) {
    return [v.x, v.y] }

  export default  {
    add:          add,
    subtract:     subtract,
    multiply:     multiply,
    divide:       divide,
    normalize:    normalize,
    normalizeTo:  normalizeTo,
    length:       length,
    lengthSq:     lengthSq,
    limit:         limit,
    distance:     distance,
    distanceSq:   distanceSq,
    scale:        scale,
    δ:            δ,
    δSq:          δSq,
    interpolate:  interpolate,
    fromArray:    fromArray,
    toArray:      toArray }
