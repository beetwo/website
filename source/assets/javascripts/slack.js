
import slack from 'slack'
import keyCodes from './key-codes'

let CHANNELS            = { website: 'C57UP2WN5'},
    USERS               = { lowi:   'U3WQ5QKK7',
                            ellie:  'U59NR94TZ'},
    CHARACTERS_PER_LINE = 43

function _channelId(channelName) {
  let channelId = _.find(CHANNELS, function(id, name) { return name === channelName })
  return channelId }

function _channelName(channelId) {
  return _.findKey(CHANNELS, function(c) { return c === channelId })}

function _username(userId) {
  let u = _.findKey(USERS, function(u) { return u === userId })
  console.log('userId',userId, u)
  return _.isNil(u) ? 'someone' : u }


function _adjustHeight(ι, τ) {

  let lineHeight  = parseInt(ι.css('line-height')),
      lines = τ.split(/\n/g),
      // we always have a height of at least two lines. one to write in one for padding
      η     = _.reduce(lines, (count, l) => { 
        count += math.max(1, _.ceil(l.length/CHARACTERS_PER_LINE) )
        return count
      }, 1)
  ι.height(η * lineHeight) 
}

function _initInput(inputSelector, buttonSelector, callback) {
  let ι = $(`${inputSelector} > textarea`),
      β = $(buttonSelector)

  // ι.focus()

  ι.keydown((ζ) => {
    // console.log('keydown ζ', ζ.key)
    let ν = ι.val()
    if(ζ.which === keyCodes.enter && !ζ.shiftKey){
      if(ν.length === 0) return
      callback(ν)
      ν = '' }
    ι.val(ν)
    _.defer(() =>{_adjustHeight(ι, ι.val())})})

  β.click(() => {
    let ν = ι.val()
    if(ι.val().length === 0) return
    callback(ν)
    ν = ''
    ι.val(ν) // clear the textbox
    _adjustHeight(ι, ν) }) }

function _initBot() {
  return new Promise((resolve, _reject) => {
    let bot = slack.rtm.client(process.env.SLACK_BOT_TOKEN)
    bot.hello((μ) => { console.log('hello from slack! ' + μ) })
    resolve(bot)
  })}

function _updateMessages(Ω, messages) {

  let messageΔ  = Ω.selectAll('.message').data(messages);

  messageΔ.enter()
    .append('div')
    .attr('class', 'message row')
    .each((μ, ι, ξ) => {
      let float = μ.local ? 'left' : 'right',
          η = d3.select(ξ[ι])
                .append('div')
                .attr('class', `${float} floated ten wide column`),
          c = η.append('div')
                .attr('class', 'content'),
          τ = μ.text.replace(/\n/g, '<br/>')

      c.append('p').html(τ)
      c.append('div')
        .attr('class', `${float} user`)
        .html(μ.local ? 'you' : _username(μ.user))

      c.style('height', '0%')
        .style('opacity', '0')
        .transition()
        .duration(300)
        .style('height', '100%')
        .style('opacity', '1')})
    // .merge(messageΔ)

  messageΔ.exit().remove()
}

function init(inputSelector, buttonSelector, outputSelector) {
  let messages      = [],
      messageId     = 1,
      Ω             = d3.select(outputSelector),
      sessionStart  = _.now()

  _initBot().then((bot) => {

    _initInput(inputSelector, buttonSelector, (text) => {
      // callback function for input events
      // passes the textarea value to be sent to slack
      let μ = { id:       messageId,
                type:     'message',
                ts:       _.now(),
                channel:  _channelId('website'),
                text:     text,
                local:    true }

      messageId += 1

      // label fade away
      d3.select(inputSelector).select('label')
        .transition()
        .duration(142)
        .style('opacity', 0)

      // join with the existing ones
      messages = _.concat(messages, μ)

      _updateMessages(Ω, messages)
      if (bot.ws) bot.ws.send(JSON.stringify(μ))
      else console.log('cannot send', JSON.stringify(μ))})

    bot.message( (μ) => {
      let timestamp = _.round(parseFloat(μ.ts) * 1000)
      if(timestamp < sessionStart) return // ignore old messages
      messages = _.concat(messages, μ)
      _updateMessages(Ω, messages) })
  
    console.log('start listening')

    // start listening
    bot.listen({token: process.env.SLACK_BOT_TOKEN})})}



export default {init: init}
