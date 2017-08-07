// https://learn.sparkfun.com/tutorials/9dof-razor-imu-m0-hookup-guide
var SerialPort = require('serialport');
var mqtt = require('mqtt')
var client;

var port = new SerialPort('/dev/tty.usbmodem141141', function (err) {
  if (err)
    return console.log('Error: ', err.message);
});

var values = [];
var length = 0;
var readonce = false;
var initialized = false;
var connected = false;

port.on('data', function (data) {
  values = data.toString('utf8').split(',').map(v => Number(v.trim()));
  length = values.length;

  if(!readonce) {
    readonce = true;
    init();
    client  = mqtt.connect('mqtt://localhost:1883');
    client.on('connect', function () {
      connected = true;
      console.log('connected');
    })
  }

  if(initialized && connected) {
    // client.publish('imu', data.toString('utf8'));
    client.publish('imu', JSON.stringify({
      yaw: values[5] * 0.0174533,
      pitch: values[6] * 0.0174533,
      roll: values[7] * 0.0174533
    }));
  } else {
    // console.log('Data:', data.toString('utf8'));
  }
});

function init() {
  function setOptions(option, on) {
    return function() {
      var before = length;
      port.write(option, function(err) {
        setTimeout(function() {
          if((on && before > length) || (!on && before < length))
            port.write(option)
        }, 100);
      })
    }
  }

  // a, g, m을 OFF시키고, q, e를 ON 시킴.
  setTimeout(setOptions('a', false), 100);
  setTimeout(setOptions('g', false), 300);
  setTimeout(setOptions('m', false), 500);
  setTimeout(setOptions('q', true), 700);
  setTimeout(setOptions('e', true), 900);
}

setTimeout(function() {
  initialized = true
}, 1100);