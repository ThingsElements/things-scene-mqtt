# MQTT data source component for Things Scene
## Concept
* Subscribe the topic using MQTT Web Socket protocol.
* Pass the message to the data of the component with the same ID as the topic.
* Support messages in JSON type only.
## Creating a development environment (Based on MacOS)
### Installing mosquitto with an MQTT broker
* Install mosquitto using homebrew.
```
$ brew install mosquitto
```
* Since Things Scene is for browsers, it must be accessible to MQTT broker via a web socket. So, enable the web service function in mosquitto.
```
$ echo -e "listener 1884\nprotocol websockets\nlistener 1883\nprotocol mqtt" >> /usr/local/opt/mosquitto/etc/mosquitto/mosquitto.conf
$ brew services restart mosquitto
```
## Setting
### If used a MQTT Broker
* broker : hostname of the broker
* port : websocket service port number (default 1884)
* path : '/mqtt'
* user : username or blank
* password : password or blank
* topic : topic
* qos : QOS level [0, 1, 2]
* client-id : (unique) client id
* data-format : [Plain Text, JSON]
* retain : true or false
* ssl : true or false (false)
### If used MQTT-Websocket Plug-in of RabbitMQ
* broker : hostname of the broker
* port : websocket service port number (default 15675)
* path : '/ws'
* user : username or blank
* password : password or blank
* topic : topic
* qos : QOS level [0, 1, 2]
* client-id : (unique) client id
* data-format : [Plain Text, JSON]
* retain : true or false
* ssl : true or false (false)
## Message Exchange if used MQTT-Websocket Plug-in of Rabbit MQ
```
When you use MQTT-Websocket Plug-in of Rabbit MQ,
it is routed by 'amq.topic' exchange of durable 'topic' type.
Therefore, the topic property of the above MQTT Data Source acts as a routing key.

To receive from MQTT Data Source using AMQP of Rabbit MQ,
see the JavaScript sample code below.
```
```
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    // Set exchange to amq.topic and durable option to true.
    var ex = 'amq.topic';

    ch.assertExchange(ex, 'topic', { durable: true });

    var location = {
      x: 100,
      y: 200
    };

    // If set the torch property to location
    ch.publish(ex, 'location', new Buffer(JSON.stringify(location)));
  });
});
```
