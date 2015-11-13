var serial = require("serialport")
  , SerialPort = serial.SerialPort
  , charm = require('simple-charm')
  , fs = require('fs')

//var device = '/dev/tty.usbmodem1421'
var device = '/dev/ttyUSB0' 

var serialPort = new SerialPort(device, {
  baudrate: 9600,
  parser: serial.parsers.readline("\n")
});

serialPort.on('open', function () {
  var app = require('path').join(__dirname, '/app.js')
  var streams = charm(app, [serialPort, 'data'])

  // LOGGING --
  // uncomment this if you want to log stuff
  // just be sure to change the file (app.js) to start the logging
//  streams.onValue(function (s) {
//    s.onValue(function (d) {
//      fs.appendFile('log.txt', d)
//    })
//  })
})
