var  _ = require("lodash")
  , takenth = require('kefir-takenth')
  , stdev   = require('compute-stdev')


function standardDevThreshold (std) {

  return function (value, buffer) {

    var mean      = average(buffer)
    var dev       = stdev(buffer)
    var threshold = mean + std*dev

    if ((std > 0) && (value > threshold))
      return 1

    if ((std < 0) && (value < threshold))
      return 1

    return 0
  }
}


function spikeDetect (s, b, stdev) {
  return s.combine(s.slidingWindow(b), standardDevThreshold(stdev))
}


function average(list) {
  return _.sum(list) / list.length
}

function stringify (buf) {
  return buf.toString()
}

function voltage (s) {
  return Number(s.split(',')[0])
}

function notNan (x) {
  return !(_.isNaN(x))
}

module.exports = function (ekg) {

// clean from serial
var parsed = ekg 
  .map(stringify).map(voltage).filter(notNan)

var spikes = spikeDetect(parsed, 100, 2.5)
  .skipDuplicates()
  .filter(function (x) { return x==1 })

parsed.bufferBy(spikes).log('')

//var windows = takenth(parsed.slidingWindow(100), 100)

return parsed.map(function (d) {
  return d + ', ' + Date.now() + '\n'
})

}

module.change_code = 1
